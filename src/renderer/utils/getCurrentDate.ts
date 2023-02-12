import dayjs from "dayjs";

export const getCurrentDate = () => {
  const currentDate = dayjs(Date.now()).toISOString();
  return currentDate;
};
