import { v4 } from "uuid";
import createStore from "zustand";
import { getCurrentDate } from "renderer/utils/getCurrentDate";
import { getLastMinuteOfToday } from "renderer/utils/getLastMinuteOfToday";

type DateStore = {
  currentDateBySecond: string;
  lastMinuteOfToday: string;
  flashcardChange: string;
};

const iStore = (): DateStore => ({
  currentDateBySecond: getCurrentDate(),
  lastMinuteOfToday: getLastMinuteOfToday(),
  flashcardChange: v4(),
});

export const dateStore = createStore<DateStore>(() => iStore());

export const resetDateStore = () => dateStore.setState(iStore());
