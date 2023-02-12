import { toast } from "react-toastify";
import { userStore } from "renderer/store/userStore";
import { Flashcard } from "main/database/schemas/flashcardSchema";
import { AnyArray } from "main/database/forbiddenTypes";
import { ApprovedChannel } from "main/ipc/errorWrapper";
import { approvedInvokeWrapper, Invoker, invokeWrapper } from "./invokeWrapper";

export const updateFlashcardInvoker = async (
  newFlashcard: Flashcard
): Invoker => {
  const oldUser = userStore.getState().user;
  if (!oldUser) throw Error("No user");
  const result = await invokeWrapper(
    "flashcards/update",
    oldUser.username,
    oldUser.password,
    newFlashcard
  );
  const { error, message } = result;
  if (error) {
    toast.error(message);
    return result;
  }
  return result;
};
