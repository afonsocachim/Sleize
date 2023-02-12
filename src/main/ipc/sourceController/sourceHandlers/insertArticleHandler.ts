import { v4 } from "uuid";
import puppeteer from "puppeteer";
import { UserDocument } from "main/database/schemas/userSchema";
import { LocalPdfSource } from "main/database/schemas/sourceSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";
import { pdfFolder } from "main/pathsToCreate";
import { validateUrl } from "main/ipc/validateUrl";
import { titleSchema } from "main/database/miscSchemas/titleSchema";

export const insertArticleHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownUrl: unknown,
  unknownName: unknown
) => {
  const owner = user.username;
  const name = validator<string>(unknownName, titleSchema);
  const url = validateUrl(unknownUrl);
  const pdfId = v4();
  const localPath = `${pdfFolder}\\${pdfId}.pdf`;

  const browser = await puppeteer.launch();
  // create a new page
  const page = await browser.newPage();

  // Load media contents
  await page.emulateMediaFeatures();
  await page.goto(url);
  let height = await page.evaluate(() => document.documentElement.scrollHeight);
  height = height > 842 ? height + 100 : 842;
  await page.pdf({
    printBackground: true,
    width: `960px`, // 3508 x 2480 (print) || 595 pixels x 842 pixels (screen)
    height: `${height}px`,
    margin: {
      top: "20px",
      bottom: "0px",
      left: "20px",
      right: "20px",
    },
    path: localPath,
  });

  await browser.close();
  const pdfSource: LocalPdfSource = {
    id: pdfId,
    owner,
    type: "ONLINE_ARTICLE",
    name,
    path: localPath,
    parent: "root",
    highlights: [],
  };
  await db.sourcecollection.insert(pdfSource);
  return { message: "Article added", data: pdfSource };
};
