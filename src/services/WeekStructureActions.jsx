// import { getPlacesValue } from "./PlacesActions";
import { store } from "../app/App";
import { convertDateToUnix, disabledMeal } from "../utils/functions";
import {
  convertUnixToDate,
  computeNbWeeksBeforeMonthEnd,
  setUnixDate,
  computeMaxWeeks,
} from "../utils/functions";

export function initDate() {
  return (dispatch) => {
    console.log("initDateBegin ");
    dispatch(initDateBegin());

    const weekStart = convertDateToUnix(
      new Date(
        new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay() + 1)
        ).setHours(0, 0, 0, 0)
      )
    );
    const monthEnd = convertDateToUnix(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    );

    const selectedWeek = {
      weekStartAbsolute: weekStart,
      weekStart: weekStart,
      weekEnd: convertDateToUnix(
        new Date(
          new Date().setDate(new Date().getDate() - new Date().getDay() + 7)
        )
      ),
      nbWeeksSinceMonthStart: 0,
      nbWeeksBeforeMonthEnd: computeNbWeeksBeforeMonthEnd(weekStart, monthEnd),
      monthStart: weekStart,
      monthEnd: convertDateToUnix(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      ),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      monthCounter: 0,
    };

    dispatch(initDateSuccess(selectedWeek));
    console.log("initDateSuccess!");
  };
}

export const INIT_DATE_BEGIN = "INIT_DATE_BEGIN";
export const INIT_DATE_SUCCESS = "INIT_DATE_SUCCESS";
export const INIT_DATE_FAILURE = "INIT_DATE_FAILURE";

export const initDateBegin = () => ({
  type: INIT_DATE_BEGIN,
});
export const initDateSuccess = (selectedWeek) => ({
  type: INIT_DATE_SUCCESS,
  payload: { selectedWeek },
});
export const initDateFailure = (error) => ({
  type: INIT_DATE_FAILURE,
  payload: { error },
});

// Sélection du mois précédent:
export function previousMonth() {
  return (dispatch) => {
    dispatch(previousMonthBegin());
    console.log("Previous Month Begin !");

    const updateWeek = {
      ...store.getState().weekStructureReducer.selectedWeek,
    };
    updateWeek.monthCounter -= 1;
    if (updateWeek.month === 0) {
      // si le mois présent est le mois de Janvier
      updateWeek.month = 11;
      updateWeek.year -= 1;
    } else {
      updateWeek.month -= 1;
    }
    updateWeek.nbWeeksBeforeMonthEnd = 0;

    const previousMonthEnd = new Date(updateWeek.year, updateWeek.month + 1, 0); // Dernier jour du mois précédent
    updateWeek.monthEnd = convertDateToUnix(previousMonthEnd);
    updateWeek.nbWeeksSinceMonthStart = 0;
    if (updateWeek.month === new Date().getMonth()) {
      updateWeek.weekStart = updateWeek.weekStartAbsolute;
      updateWeek.weekEnd = setUnixDate(updateWeek.weekStartAbsolute, 6);
      updateWeek.monthStart = new Date().getDate();
      updateWeek.nbWeeksBeforeMonthEnd = computeNbWeeksBeforeMonthEnd(
        updateWeek.weekStartAbsolute,
        updateWeek.monthEnd
      );
    } else {
      const previousMonthStart = new Date(updateWeek.year, updateWeek.month, 1); // Premier jour du mois précédent
      updateWeek.weekStart = setUnixDate(
        convertDateToUnix(previousMonthStart),
        -(previousMonthStart.getDay() || 7) + 1
      );
      updateWeek.weekEnd = setUnixDate(
        convertDateToUnix(previousMonthStart),
        -(previousMonthStart.getDay() || 7) + 7
      );
      updateWeek.monthStart = convertDateToUnix(previousMonthStart);
      updateWeek.nbWeeksBeforeMonthEnd = computeMaxWeeks(
        convertDateToUnix(previousMonthStart),
        convertDateToUnix(previousMonthEnd)
      );
    }
    dispatch(previousMonthSuccess(updateWeek));
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
    console.log("Next Month Begin!");

    const updateWeek = {
      ...store.getState().weekStructureReducer.selectedWeek,
    };
    updateWeek.monthCounter += 1;
    if (updateWeek.month === 11) {
      updateWeek.year += 1;
      updateWeek.month = 0;
    } else {
      updateWeek.month += 1;
    }
    const nextMonthStart = new Date(updateWeek.year, updateWeek.month, 1); // Premier jour du mois
    const nextMonthEnd = new Date(updateWeek.year, updateWeek.month + 1, 0); // Dernier jour du mois
    updateWeek.monthStart = convertDateToUnix(nextMonthStart);
    updateWeek.monthEnd = convertDateToUnix(nextMonthEnd);
    updateWeek.nbWeeksSinceMonthStart = 0;
    updateWeek.weekStart = setUnixDate(
      updateWeek.monthStart,
      -(nextMonthStart.getDay() || 7) + 1
    );
    updateWeek.weekEnd = setUnixDate(
      updateWeek.monthStart,
      -(nextMonthStart.getDay() || 7) + 7
    );
    updateWeek.nbWeeksBeforeMonthEnd = computeMaxWeeks(
      updateWeek.monthStart,
      updateWeek.monthEnd
    );
    dispatch(nextMonthSuccess(updateWeek));
    console.log("Next Month Success!");
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

export function previousWeek() {
  const updateWeek = { ...store.getState().weekStructureReducer.selectedWeek };
  return (dispatch) => {
    dispatch(previousWeekBegin());
    console.log("previousWeek Begin!");
    updateWeek.weekStart = setUnixDate(updateWeek.weekStart, -7);
    updateWeek.weekEnd = setUnixDate(updateWeek.weekEnd, -7);
    updateWeek.nbWeeksBeforeMonthEnd += 1;
    updateWeek.nbWeeksSinceMonthStart -= 1;
    dispatch(previousWeekSuccess(updateWeek));
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
  const updateWeek = { ...store.getState().weekStructureReducer.selectedWeek };
  return (dispatch) => {
    dispatch(nextWeekBegin());
    console.log("nextWeekBegin!");
    updateWeek.weekStart = setUnixDate(updateWeek.weekStart, 7);
    updateWeek.weekEnd = setUnixDate(updateWeek.weekEnd, 7);
    updateWeek.nbWeeksSinceMonthStart += 1;
    updateWeek.nbWeeksBeforeMonthEnd -= 1;

    dispatch(nextWeekSuccess(updateWeek));
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

export function previousMonthLastWeek() {
  const updateWeek = { ...store.getState().weekStructureReducer.selectedWeek };

  return (dispatch) => {
    dispatch(previousMonthLastWeekBegin());
    console.log("previous Month LastWeek Begin !!");
    if (updateWeek.weekStart === updateWeek.monthStart) {
      updateWeek.weekStart = setUnixDate(updateWeek.weekStart, -7);
      updateWeek.weekEnd = setUnixDate(updateWeek.weekEnd, -7);
    }
    updateWeek.monthCounter -= 1;
    if (updateWeek.month === 0) {
      updateWeek.month = 11;
      updateWeek.year -= 1;
    } else {
      updateWeek.month -= 1;
    }
    updateWeek.monthStart = convertDateToUnix(
      new Date(updateWeek.year, updateWeek.month, 1)
    );
    updateWeek.monthEnd = convertDateToUnix(
      new Date(new Date().getFullYear(), updateWeek.month + 1, 0)
    );

    if (updateWeek.month === new Date().getMonth()) {
      updateWeek.nbWeeksSinceMonthStart = computeNbWeeksBeforeMonthEnd(
        updateWeek.weekStartAbsolute,
        updateWeek.monthEnd
      );
    } else {
      updateWeek.nbWeeksSinceMonthStart = computeMaxWeeks(
        updateWeek.monthStart,
        updateWeek.monthEnd
      );
    }
    updateWeek.nbWeeksBeforeMonthEnd = 0;

    dispatch(previousMonthLastWeekSuccess(updateWeek));
    console.log("previous Month LastWeek Success !!");
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
export function updateWeekStructure() {
  const config = store.getState().configurationReducer.configuration;
  const selectedWeek = JSON.parse(
    JSON.stringify(store.getState().weekStructureReducer.selectedWeek)
  );
  const weekStructure = JSON.parse(
    JSON.stringify(store.getState().weekStructureReducer.weekStructure)
  );

  return (dispatch) => {
    console.log("update WeekStructure Begin");
    console.log(convertUnixToDate(selectedWeek.monthStart));
    dispatch(updateWeekStructureBegin());
    for (let i = 0; i < 7; i++) {
      weekStructure.breakfast[i].disabled = disabledMeal(
        convertUnixToDate(selectedWeek.weekStart),
        i,
        convertUnixToDate(selectedWeek.monthStart),
        convertUnixToDate(selectedWeek.monthEnd),
        config.deadline.breakfast
      );
      weekStructure.lunch[i].disabled = disabledMeal(
        convertUnixToDate(selectedWeek.weekStart),
        i,
        convertUnixToDate(selectedWeek.monthStart),
        convertUnixToDate(selectedWeek.monthEnd),
        config.deadline.lunch
      );
      weekStructure.dinner[i].disabled = disabledMeal(
        convertUnixToDate(selectedWeek.weekStart),
        i,
        convertUnixToDate(selectedWeek.monthStart),
        convertUnixToDate(selectedWeek.monthEnd),
        config.deadline.lunch
      );
    }
    console.log(weekStructure);
    dispatch(updateWeekStructureSuccess(weekStructure));
    console.log("updateWeekStructureSuccess !");
  };
}

export const UPDATE_WEEKSTRUCTURE_BEGIN = "UPDATE_WEEKSTRUCTURE_BEGIN";
export const UPDATE_WEEKSTRUCTURE_SUCCESS = "UPDATE_WEEKSTRUCTURE_SUCCESS";
export const UPDATE_WEEKSTRUCTURE_FAILURE = "UPDATE_WEEKSTRUCTURE_FAILURE";

export const updateWeekStructureBegin = () => ({
  type: UPDATE_WEEKSTRUCTURE_BEGIN,
});
export const updateWeekStructureSuccess = (update) => ({
  type: UPDATE_WEEKSTRUCTURE_SUCCESS,
  payload: { update },
});
export const updateWeekStructureFailure = (error) => ({
  type: UPDATE_WEEKSTRUCTURE_FAILURE,
  payload: { error },
});
