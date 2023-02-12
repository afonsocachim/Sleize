const pad = (s: number) => {
  if (s < 10) return `0${s}`;
  return s.toString();
};

export const sToHMS = (s: number): string => {
  // 1- Convert to seconds:
  let seconds: number = Math.round(s);
  // 2- Extract hours:
  const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
  seconds %= 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds %= 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
