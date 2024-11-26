import { INIT_DATE_BEGIN } from "./DateActions";
import { INIT_DATE_SUCCESS } from "./DateActions";

import { PREVIOUS_WEEK_BEGIN } from "./DateActions";
import { PREVIOUS_WEEK_SUCCESS } from "./DateActions";

import { NEXT_WEEK_BEGIN } from "./DateActions";
import { NEXT_WEEK_SUCCESS } from "./DateActions";

import { PREVIOUS_MONTH_LAST_WEEK_BEGIN } from "./DateActions";
import { PREVIOUS_MONTH_LAST_WEEK_SUCCESS } from "./DateActions";

import { PREVIOUS_MONTH_BEGIN } from "./DateActions";
import { PREVIOUS_MONTH_SUCCESS } from "./DateActions";
import { NEXT_MONTH_BEGIN } from "./DateActions";
import { NEXT_MONTH_SUCCESS } from "./DateActions";

const initialState = {
  todayDate: null,
  currentWeek: {
    weekStart: null,
    weekEnd: null,
  },
  currentMonth: {
    month: null,
    year: null,
    minWeek: 1,
    maxWeek: null,
  },
  currentDay: {
    weekDay: null,
    monthDay: null,
    hour: null,
  },
  selectedWeek: {
    weekStart: null,
    weekEnd: null,
  },
  selectedMonth: {
    month: null,
    year: null,
    nbWeeksSinceMonthStart: 0,
    nbWeeksBeforeMonthEnd: null,
    monthStart: null,
    monthEnd: null,
  },
};

export default function DateReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_DATE_BEGIN:
      return {
        ...state,
      };
    case INIT_DATE_SUCCESS:
      return {
        ...state,
        todayDate: action.payload.initDate.todayDate,
        currentWeek: action.payload.initDate.currentWeek,
        currentMonth: action.payload.initDate.currentMonth,
        currentDay: action.payload.initDate.currentDay,
        selectedWeek: action.payload.initDate.selectedWeek,
        selectedMonth: action.payload.initDate.selectedMonth,
      };
    case PREVIOUS_WEEK_BEGIN:
      return {
        ...state,
      };
    case PREVIOUS_WEEK_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update.selectedWeek,
        selectedMonth: action.payload.update.selectedMonth,
      };
    case NEXT_WEEK_BEGIN:
      return {
        ...state,
      };
    case NEXT_WEEK_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update.selectedWeek,
        selectedMonth: action.payload.update.selectedMonth,
      };
    case PREVIOUS_MONTH_LAST_WEEK_BEGIN:
      return {
        ...state,
      };
    case PREVIOUS_MONTH_LAST_WEEK_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update.selectedWeek,
        selectedMonth: action.payload.update.selectedMonth,
      };
    case PREVIOUS_MONTH_BEGIN:
      return {
        ...state,
      };
    case PREVIOUS_MONTH_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update.selectedWeek,
        selectedMonth: action.payload.update.selectedMonth,
      };
    case NEXT_MONTH_BEGIN:
      return {
        ...state,
      };
    case NEXT_MONTH_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update.selectedWeek,
        selectedMonth: action.payload.update.selectedMonth,
      };
    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
