// import { getPlacesValue } from "./PlacesActions";
import { store } from "../app/App";
import { useSelector } from "react-redux";
import {
  convertDateToUnix,
  disabledMeal,
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

export function initWeekStructure() {
  return (dispatch) => {
    console.log("initWeekStructureBegin ");
    dispatch(initWeekStructureBegin());
    const places = store.getState().placesReducer.places;

    const weekStructure = places.map((place, index) => {
      return {
        rowId: place.rowid,
        label: place.label,
        isUnfolded: 1,
        mealLines: [
          Array(7).fill({
            meal: "breakfast",
            regimeColor: "",
            booked: 0,
            disabled: 0,
          }),

          Array(7).fill({
            meal: "lunch",
            regimeColor: "",
            booked: 0,
            disabled: 0,
          }),
          Array(7).fill({
            meal: "dinner",
            regimeColor: "",
            booked: 0,
            disabled: 0,
          }),
        ],
      };
    });
    dispatch(initWeekStructureSuccess(weekStructure));
    console.log("initWeekStructureSuccess!");
  };
}

export const INIT_WEEKSTRUCTURE_BEGIN = "INIT_WEEKSTRUCTURE_BEGIN";
export const INIT_WEEKSTRUCTURE_SUCCESS = "INIT_WEEKSTRUCTURE_SUCCESS";
export const INIT_WEEKSTRUCTURE_FAILURE = "INIT_WEEKSTRUCTURE_FAILURE";

export const initWeekStructureBegin = () => ({
  type: INIT_WEEKSTRUCTURE_BEGIN,
});
export const initWeekStructureSuccess = (weekStructure) => ({
  type: INIT_WEEKSTRUCTURE_SUCCESS,
  payload: { weekStructure },
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
      updateWeek.monthStart = convertDateToUnix(new Date()); //new Date().getDate()
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

export function updateRegime(regimeId) {
  return (dispatch) => {
    dispatch(updateRegimeBegin());
    console.log("updateRegime Begin!");
    console.log("regimeID: ", regimeId);
    dispatch(updateRegimeSuccess(regimeId));
    console.log("updateRegime Success!");
  };
}

export const UPDATE_REGIME_BEGIN = "UPDATE_REGIME_BEGIN";
export const UPDATE_REGIME_SUCCESS = "UPDATE_REGIME_SUCCESS";
export const updateRegimeBegin = () => ({
  type: UPDATE_REGIME_BEGIN,
});
export const updateRegimeSuccess = (regimeId) => ({
  type: UPDATE_REGIME_SUCCESS,
  payload: { regimeId },
});

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

export function updateWeekStructure(orderLines, regimesList) {
  console.log("update WeekStructure Begin");
  const config = store.getState().configurationReducer.configuration;
  const selectedWeek = JSON.parse(
    JSON.stringify(store.getState().weekStructureReducer.selectedWeek)
  );
  const weekStructures = JSON.parse(
    JSON.stringify(store.getState().weekStructureReducer.weekStructure)
  );
  return (dispatch) => {
    dispatch(updateWeekStructureBegin());

    weekStructures.map((weekStructure) => {
      return weekStructure.mealLines.map((mealLine, mealId) => {
        return mealLine.map((mealBox, weekDay) => {
          mealBox.disabled = disabledMeal(
            convertUnixToDate(selectedWeek.weekStart),
            weekDay,
            convertUnixToDate(selectedWeek.monthStart),
            convertUnixToDate(selectedWeek.monthEnd),
            config.deadline[mealId]
          );
          let mealBoxTmp = "";
          mealBoxTmp = convertOrderLinesToBox(
            orderLines,
            weekStructure.rowId,
            mealId,
            regimesList,
            config.dolibarrMealCode,
            selectedWeek.weekStart,
            weekDay
          );
          mealBox.booked = mealBoxTmp.booked;
          mealBox.regimeColor = mealBoxTmp.regimeColor;
        });
      });
    });
    dispatch(updateWeekStructureSuccess(weekStructures));
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

export function updateFolding(rowId) {
  const weekStructures = JSON.parse(
    JSON.stringify(store.getState().weekStructureReducer.weekStructure)
  );
  return (dispatch) => {
    console.log("update Folding Begin");
    dispatch(updateFoldingBegin());
    weekStructures.map((weekStructure) => {
      if (weekStructure.rowId === rowId) {
        weekStructure.isUnfolded = !weekStructure.isUnfolded;
      }
    });
    dispatch(updateFoldingSuccess(weekStructures));
    console.log("updatFoldingSuccess !");
  };
}

export const UPDATE_FOLDING_BEGIN = "UPDATE_FOLDING_BEGIN";
export const UPDATE_FOLDING_SUCCESS = "UPDATE_FOLDING_SUCCESS";
export const UPDATE_FOLDING_FAILURE = "UPDATE_FOLDING_FAILURE";

export const updateFoldingBegin = () => ({
  type: UPDATE_FOLDING_BEGIN,
});
export const updateFoldingSuccess = (update) => ({
  type: UPDATE_FOLDING_SUCCESS,
  payload: { update },
});
export const updateFoldingFailure = (error) => ({
  type: UPDATE_FOLDING_FAILURE,
  payload: { error },
});

export const convertOrderLinesToBox = (
  orderLines,
  placeId,
  mealId,
  regimesList,
  dolibarrMealCode,
  weekStart,
  weekDay
) => {
  let output = {};
  output.booked = 0;
  output.regimeColor = "";
  orderLines.map((orderLine) => {
    const options = orderLine.array_options;
    const checkBox_weekDay = setUnixDate(weekStart, weekDay); // jour correspondant à la mealBox considérée

    if (
      // Si le lieu correspond à placeId et si le fk_product correspond au repas
      placeId === options.options_lin_intakeplace &&
      orderLine.fk_product === String(dolibarrMealCode[mealId]) &&
      checkBox_weekDay >= options.options_lin_datedebut &&
      checkBox_weekDay <= options.options_lin_datefin // si la weekStructure correspond au lieu indiqué dans orderLines
    ) {
      output.booked = 1;
      output.regimeColor = convertRegimeToColor(
        regimesList,
        options.options_lin_room
      );
    }
  });
  return output;
};

const convertRegimeToColor = (regimesList, regimeId) => {
  // identifier le regime en question (regimeId) dans le régimeReducer

  // trouver le regime correspondant dans le fichier de configuration à l'aide de son code
  if (regimesList) {
    const regimeSaved = regimesList.find((regime) => regime.rowid == regimeId);
    const regimeConfig = store
      .getState()
      .configurationReducer.configuration.regimes.find(
        (regime) => regime.code === regimeSaved.code
      );
    // Retourner la couleur:
    return regimeConfig.color;
  } else return "blue";
};
