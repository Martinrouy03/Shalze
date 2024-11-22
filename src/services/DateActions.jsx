import { store } from "../app/App";
import {
  convertTimeToUnix,
  convertDateToUnix,
  setUnixDate,
  computeMaxWeeks,
  computeNbWeeksBeforeMonthEnd,
  convertUnixToDate,
} from "../utils/functions";

export function initDate() {
  return (dispatch) => {
    dispatch(initDateBegin());
    console.log("initDateBegin!!");

    const today = new Date();
    const todayUnix = convertDateToUnix(today);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentMonthDay = today.getDate();
    const currentWeekDay = today.getDay();
    let weekStart = new Date().setDate(currentMonthDay - currentWeekDay + 1);
    let weekEnd = new Date().setDate(currentMonthDay - currentWeekDay + 7);
    let monthEnd = new Date(currentYear, currentMonth + 1, 0);
    weekStart = convertTimeToUnix(weekStart);
    weekEnd = convertTimeToUnix(weekEnd);
    const monthStart = convertDateToUnix(today);
    monthEnd = convertDateToUnix(monthEnd);
    const currentHour = today.getHours();
    const maxWeek = computeNbWeeksBeforeMonthEnd(weekStart, monthEnd);

    dispatch(
      initDateSuccess({
        todayDate: todayUnix,
        currentWeek: {
          weekStart: weekStart,
          weekEnd: weekEnd,
        },
        currentMonth: {
          month: currentMonth,
          year: currentYear,
          minWeek: 1,
          maxWeek: maxWeek,
        },
        currentDay: {
          weekDay: currentWeekDay,
          monthDay: currentMonthDay,
          hour: currentHour,
        },
        selectedWeek: {
          weekStart: weekStart,
          weekEnd: weekEnd,
        },
        selectedMonth: {
          month: currentMonth,
          year: currentYear,
          nbWeeksSinceMonthStart: 0,
          nbWeeksBeforeMonthEnd: maxWeek,
          monthStart: monthStart,
          monthEnd: monthEnd,
        },
      })
    );
    console.log("initDateSuccess!!");
  };
}

export const INIT_DATE_BEGIN = "INIT_DATE_BEGIN";
export const initDateBegin = () => ({
  type: INIT_DATE_BEGIN,
});
export const INIT_DATE_SUCCESS = "INIT_DATE_SUCCESS";
export const initDateSuccess = (initDate) => ({
  type: INIT_DATE_SUCCESS,
  payload: { initDate },
});

export function getDateValue() {
  let dateReducer = store.getState().dateReducer;
  return dateReducer;
}

// Sélection de la semaine précédente du mois en cours:
export function previousWeek() {
  return (dispatch) => {
    dispatch(previousWeekBegin());
    console.log("previousWeek Begin!");
    const dateReducer = store.getState().dateReducer;
    const updateWeek = { ...dateReducer.selectedWeek };
    const updateMonth = { ...dateReducer.selectedMonth };
    updateWeek.weekStart = setUnixDate(updateWeek.weekStart, -7);
    updateWeek.weekEnd = setUnixDate(updateWeek.weekEnd, -7);
    updateMonth.nbWeeksBeforeMonthEnd += 1;
    updateMonth.nbWeeksSinceMonthStart -= 1;
    dispatch(
      previousWeekSuccess({
        selectedWeek: updateWeek,
        selectedMonth: updateMonth,
      })
    );
    console.log("previousWeek Success!");
  };
}

export const PREVIOUS_WEEK_BEGIN = "PREVIOUS_WEEK_BEGIN";
export const PREVIOUS_WEEK_SUCCESS = "PREVIOUS_WEEK_SUCCESS";
export const previousWeekBegin = () => ({
  type: PREVIOUS_WEEK_BEGIN,
});
export const previousWeekSuccess = (update) => ({
  type: PREVIOUS_WEEK_SUCCESS,
  payload: { update },
});

// Sélection de la semaine suivante

export function nextWeek() {
  return (dispatch) => {
    dispatch(nextWeekBegin());
    console.log("nextWeekBegin!");
    const dateReducer = store.getState().dateReducer;
    const updateWeek = { ...dateReducer.selectedWeek };
    const updateMonth = { ...dateReducer.selectedMonth };
    updateWeek.week += 1;
    updateWeek.weekStart = setUnixDate(updateWeek.weekStart, 7);
    updateWeek.weekEnd = setUnixDate(updateWeek.weekEnd, 7);
    updateMonth.nbWeeksSinceMonthStart += 1;
    updateMonth.nbWeeksBeforeMonthEnd -= 1;

    dispatch(
      nextWeekSuccess({
        selectedWeek: updateWeek,
        selectedMonth: updateMonth,
      })
    );
    console.log("nextWeekSuccess!");
  };
}

export const NEXT_WEEK_BEGIN = "NEXT_WEEK_BEGIN";
export const NEXT_WEEK_SUCCESS = "NEXT_WEEK_SUCCESS";
export const nextWeekBegin = () => ({
  type: NEXT_WEEK_BEGIN,
});
export const nextWeekSuccess = (update) => ({
  type: NEXT_WEEK_SUCCESS,
  payload: { update },
});

// Sélection du mois précédent, dans le cas où les mois précédent n'est pas le mois courant:
export function previousMonthLastWeek() {
  return (dispatch) => {
    dispatch(previousMonthLastWeekBegin());
    console.log("previousMonthLastWeekBegin !!");
    const dateReducer = store.getState().dateReducer;
    const updateWeek = { ...dateReducer.selectedWeek };
    const updateMonth = { ...dateReducer.selectedMonth };
    const currentMonth = { ...dateReducer.currentMonth };
    if (updateWeek.weekStart === updateMonth.monthStart) {
      updateWeek.weekStart = setUnixDate(updateWeek.weekStart, -7);
      updateWeek.weekEnd = setUnixDate(updateWeek.weekEnd, -7);
    }
    if (updateMonth.month === 0) {
      updateMonth.month = 11;
      updateMonth.year -= 1;
    } else {
      updateMonth.month -= 1;
    }
    const currentYear = currentMonth.year;
    let previousMonthStart = new Date(updateMonth.year, updateMonth.month, 1); // Premier jour du mois dernier
    updateMonth.monthStart = convertDateToUnix(previousMonthStart);
    let previousMonthEnd = new Date(currentYear, updateMonth.month + 1, 0); // Dernier jour du mois dernier
    updateMonth.monthEnd = convertDateToUnix(previousMonthEnd);

    if (updateMonth.month === currentMonth.month) {
      updateMonth.nbWeeksSinceMonthStart = currentMonth.maxWeek;
    } else {
      updateMonth.nbWeeksSinceMonthStart = computeMaxWeeks(
        convertDateToUnix(previousMonthStart),
        convertDateToUnix(previousMonthEnd)
      );
    }
    updateMonth.nbWeeksBeforeMonthEnd = 0;

    dispatch(
      previousMonthLastWeekSuccess({
        selectedWeek: updateWeek,
        selectedMonth: updateMonth,
      })
    );
    console.log("previousMonthLastWeekSuccess !!");
  };
}

export const PREVIOUS_MONTH_LAST_WEEK_BEGIN = "PREVIOUS_MONTH_LAST_WEEK_BEGIN";
export const PREVIOUS_MONTH_LAST_WEEK_SUCCESS =
  "PREVIOUS_MONTH_LAST_WEEK_SUCCESS";
export const previousMonthLastWeekBegin = () => ({
  type: PREVIOUS_MONTH_LAST_WEEK_BEGIN,
});
export const previousMonthLastWeekSuccess = (update) => ({
  type: PREVIOUS_MONTH_LAST_WEEK_SUCCESS,
  payload: { update },
});

// Sélection du mois précédent:
export function previousMonth() {
  return (dispatch) => {
    dispatch(previousMonthBegin());
    console.log("Previous Month Begin !");
    const dateReducer = store.getState().dateReducer;
    const updateWeek = { ...dateReducer.selectedWeek };
    const updateMonth = { ...dateReducer.selectedMonth };
    const currentWeek = { ...dateReducer.currentWeek };
    const currentMonth = { ...dateReducer.currentMonth };
    if (updateMonth.month === 0) {
      // si le mois présent est le mois de Janvier
      updateMonth.month = 11;
      updateMonth.year -= 1;
    } else {
      updateMonth.month -= 1;
    }
    updateMonth.nbWeeksBeforeMonthEnd = 0;

    const previousMonthEnd = new Date(
      updateMonth.year,
      updateMonth.month + 1,
      0
    ); // Dernier jour du mois précédent
    const previousMonthEndUnix = convertDateToUnix(previousMonthEnd);
    updateMonth.monthEnd = previousMonthEndUnix;
    updateMonth.nbWeeksSinceMonthStart = 0;
    if (updateMonth.month === currentMonth.month) {
      updateWeek.weekStart = currentWeek.weekStart;
      updateWeek.weekEnd = currentWeek.weekEnd;
      updateMonth.monthStart = dateReducer.todayDate;
      updateMonth.nbWeeksBeforeMonthEnd = currentMonth.maxWeek;
    } else {
      const previousMonthStart = new Date(
        updateMonth.year,
        updateMonth.month,
        1
      ); // Premier jour du mois précédent
      // console.log(previousMonthStart);

      updateWeek.weekStart = setUnixDate(
        convertDateToUnix(previousMonthStart),
        -(previousMonthStart.getDay() || 7) + 1
      );
      updateWeek.weekEnd = setUnixDate(
        convertDateToUnix(previousMonthStart),
        -(previousMonthStart.getDay() || 7) + 7
      );
      updateMonth.monthStart = convertDateToUnix(previousMonthStart);
      updateMonth.nbWeeksBeforeMonthEnd = computeMaxWeeks(
        convertDateToUnix(previousMonthStart),
        convertDateToUnix(previousMonthEnd)
      );
    }
    dispatch(
      previousMonthSuccess({
        selectedMonth: updateMonth,
        selectedWeek: updateWeek,
      })
    );
    console.log("Previous Month Success !");
  };
}

export const PREVIOUS_MONTH_BEGIN = "PREVIOUS_MONTH_BEGIN";
export const PREVIOUS_MONTH_SUCCESS = "PREVIOUS_MONTH_SUCCESS";
export const previousMonthBegin = () => ({
  type: PREVIOUS_MONTH_BEGIN,
});
export const previousMonthSuccess = (update) => ({
  type: PREVIOUS_MONTH_SUCCESS,
  payload: { update },
});

// Sélection du mois suivant:
export function nextMonth() {
  return (dispatch) => {
    dispatch(nextMonthBegin());
    console.log("nextMonthBegin!");
    const dateReducer = store.getState().dateReducer;
    const updateMonth = { ...dateReducer.selectedMonth };
    const updateWeek = { ...dateReducer.selectedWeek };
    if (updateMonth.month === 11) {
      updateMonth.year += 1;
      updateMonth.month = 0;
    } else {
      updateMonth.month += 1;
    }
    const currentYear = updateMonth.year;
    const nextMonthStart = new Date(currentYear, updateMonth.month, 1); // Premier jour du mois
    const nextMonthEnd = new Date(currentYear, updateMonth.month + 1, 0); // Dernier jour du mois

    updateMonth.monthStart = convertDateToUnix(nextMonthStart);
    updateMonth.monthEnd = convertDateToUnix(nextMonthEnd);
    updateWeek.week = 1;
    updateMonth.nbWeeksSinceMonthStart = 0;
    // si le dernier jour du mois tombe le dernier jour de la semaine
    updateWeek.weekStart = setUnixDate(
      updateMonth.monthStart,
      -(nextMonthStart.getDay() || 7) + 1
    );
    updateWeek.weekEnd = setUnixDate(
      updateMonth.monthStart,
      -(nextMonthStart.getDay() || 7) + 7
    );
    updateMonth.nbWeeksBeforeMonthEnd = computeMaxWeeks(
      convertDateToUnix(nextMonthStart),
      convertDateToUnix(nextMonthEnd)
    );
    dispatch(
      nextMonthSuccess({ selectedWeek: updateWeek, selectedMonth: updateMonth })
    );
    console.log("nextMonthSuccess!");
  };
}

export const NEXT_MONTH_BEGIN = "NEXT_MONTH_BEGIN";
export const nextMonthBegin = () => ({
  type: NEXT_MONTH_BEGIN,
});
export const NEXT_MONTH_SUCCESS = "NEXT_MONTH_SUCCESS";
export const nextMonthSuccess = (update) => ({
  type: NEXT_MONTH_SUCCESS,
  payload: { update },
});
