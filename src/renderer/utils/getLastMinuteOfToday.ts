import dayjs from "dayjs";

export const getLastMinuteOfToday = () => {
  const currentDate = dayjs(Date.now()).toISOString();
  const lastMinuteOfToday = `${currentDate.slice(0, 11)}23:59:99.999Z`;
  return lastMinuteOfToday;
};
