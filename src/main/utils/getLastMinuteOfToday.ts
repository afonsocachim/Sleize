import { getCurrentDate } from "./getCurrentDate";

export const getLastMinuteOfToday = () => {
  const lastMinuteOfToday = `${getCurrentDate().slice(0, 11)}23:59:99.999Z`;
  return lastMinuteOfToday;
};
