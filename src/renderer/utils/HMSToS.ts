export const HMSToS = (HMS: string): number => {
  let counter = 0;
  const [hours, minutes, seconds] = HMS.split(":");
  counter += parseInt(hours, 10) * 3600;
  counter += parseInt(minutes, 10) * 60;
  counter += parseInt(seconds, 10);
  return counter;
};
