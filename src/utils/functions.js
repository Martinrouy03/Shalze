import moment from "moment";

export const convertTimeToUnix = (date) => {
  return Math.floor(date / 1000);
};
export const convertDateToUnix = (date) => {
  return Math.floor(date.getTime() / 1000);
};

export const convertUnixToDate = (unixDate) => {
  return new Date(moment.unix(unixDate));
};

export const convertUnixToWeekDay = (unixDate) => {
  const date = new Date(moment.unix(unixDate));
  return date.getDay();
};
export const convertUnixToDay = (unixDate) => {
  const date = new Date(moment.unix(unixDate));
  return date.getDate();
};
export const convertUnixToMonth = (unixDate) => {
  const date = new Date(moment.unix(unixDate));
  console.log(date);
  return date.getMonth();
};

export const setUnixDate = (unixDate, shift) => {
  // console.log(shift);
  const date = convertUnixToDate(unixDate);
  // console.log("date before: ", date);
  const monthDay = date.getDate();
  // console.log("date: ", date);
  // console.log("monthDay + shift: ", monthDay + shift);
  date.setDate(monthDay + shift);
  // console.log(date);
  // console.log("date after: ", date);
  return convertDateToUnix(date);
};

export function computeMaxWeeks(monthStart, monthEnd) {
  const start = convertUnixToWeekDay(monthStart) || 7;
  const end = convertUnixToDay(monthEnd);
  const maxWeeks = Math.floor((end + start) / 7);
  // console.log(start, end, maxWeeks);
  return maxWeeks;
}
export function computeNbWeeksBeforeMonthEnd(weekStart, monthEnd) {
  const start = convertUnixToDay(weekStart);
  const end = convertUnixToDay(monthEnd);
  const nbWeeksBeforeMonthEnd = Math.floor((end - start) / 7);
  // console.log(start, end, nbWeeksBeforeMonthEnd);
  return nbWeeksBeforeMonthEnd;
}
export function computeNbWeeksSinceMonthStart(weekEnd, monthStart) {
  const end = convertUnixToDay(weekEnd);
  const start = convertUnixToDay(monthStart);
  const nbWeeksBeforeMonthEnd = Math.floor((end - start) / 7);
  // console.log(start, end, nbWeeksBeforeMonthEnd);
  return nbWeeksBeforeMonthEnd;
}
