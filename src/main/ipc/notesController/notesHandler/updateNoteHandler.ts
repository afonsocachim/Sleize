import { ajvNoteSchema, Note } from "main/database/schemas/noteSchema";
import { UserDocument } from "main/database/schemas/userSchema";
import { RxMyDatabase } from "main/database/databaseTypes";
import { validator } from "main/ipc/validator";

export const updateNoteHandler = async (
  user: UserDocument,
  db: RxMyDatabase,
  unknownNewNote: unknown
) => {
  const s = validator<Note>(unknownNewNote, ajvNoteSchema);
  const partialNote: Partial<Note> = { ...s };

  const oldNote = await db.notecollection
    .findOne({ selector: { id: s.id } })
    .exec();
  if (!oldNote) throw Error("No old note");
  if (oldNote.data.owner !== user.username) throw Error("User not owner");

  // need to remove primary key b4 update
  delete partialNote.id;
  await oldNote.atomicPatch(partialNote);
  const newNote = oldNote.toJSON();
  return { message: "Source updated", data: newNote };
};
