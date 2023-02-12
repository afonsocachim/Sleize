import { app } from "electron";

export const userDocuments = `${app.getPath("userData")}\\UserDocuments`;
export const pdfFolder = `${app.getPath("userData")}\\Pdfs`;
export const dbFolder = `${app.getPath("userData")}\\UserDatabase`;
export const pathsToCreate = [userDocuments, pdfFolder, dbFolder];
