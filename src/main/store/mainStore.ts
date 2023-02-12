import { UserDocument } from "main/database/schemas/userSchema";
import { getCurrentDate } from "main/utils/getCurrentDate";
import { getLastMinuteOfToday } from "main/utils/getLastMinuteOfToday";
import createStore from "zustand/vanilla";

type MainStore = {
  user: UserDocument | null;
  lastMinuteOfToday: string;
  currentDate: string;
};

const iStore: MainStore = {
  user: null,
  lastMinuteOfToday: getLastMinuteOfToday(),
  currentDate: getCurrentDate(),
};

export const mainStore = createStore<MainStore>(() => iStore);
