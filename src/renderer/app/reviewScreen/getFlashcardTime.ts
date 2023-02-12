export const getFlashcardTime = (n: number) => {
  const minute = 1;
  const hour = 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  const timeArray = [
    { n: year, t: "y" },
    { n: month, t: "mo" },
    { n: week, t: "wk" },
    { n: day, t: "d" },
    { n: hour, t: "h" },
    { n: minute, t: "m" },
  ];
  let lastN = "";
  for (let i = 0; i < timeArray.length; i += 1) {
    const newN = n / timeArray[i].n;
    if (newN >= 1) {
      const decimal = parseInt(newN.toFixed(1).slice(-1), 10);
      const integer = Math.floor(newN);
      const decimalText = decimal ? `.${decimal}` : "";
      lastN = integer + decimalText + timeArray[i].t;
      break;
    }
  }
  if (!lastN) throw Error(`No lastN: ${lastN}`);
  return lastN;
};
