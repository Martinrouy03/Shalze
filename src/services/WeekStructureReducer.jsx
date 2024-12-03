import {
  INIT_DATE_BEGIN,
  INIT_DATE_SUCCESS,
  INIT_WEEKSTRUCTURE_BEGIN,
  INIT_WEEKSTRUCTURE_SUCCESS,
  INIT_WEEKSTRUCTURE_FAILURE,
  UPDATE_REGIME_BEGIN,
  UPDATE_REGIME_SUCCESS,
  PREVIOUS_MONTH_BEGIN,
  PREVIOUS_MONTH_SUCCESS,
  NEXT_MONTH_BEGIN,
  NEXT_MONTH_SUCCESS,
  PREVIOUS_WEEK_BEGIN,
  PREVIOUS_WEEK_SUCCESS,
  NEXT_WEEK_BEGIN,
  NEXT_WEEK_SUCCESS,
  PREVIOUS_MONTH_LAST_WEEK_BEGIN,
  PREVIOUS_MONTH_LAST_WEEK_SUCCESS,
  UPDATE_WEEKSTRUCTURE_BEGIN,
  UPDATE_WEEKSTRUCTURE_SUCCESS,
  UPDATE_WEEKSTRUCTURE_FAILURE,
  UPDATE_FOLDING_BEGIN,
  UPDATE_FOLDING_SUCCESS,
} from "./WeekStructureActions";

const initialState = {
  selectedWeek: {
    weekStartAbsolute: null,
    weekStart: null,
    weekEnd: null,
    nbWeeksSinceMonthStart: 0,
    nbWeeksBeforeMonthEnd: null,
    monthStart: null,
    monthEnd: null,
    month: null,
    year: null,
    monthCounter: 0,
  },
  regimeSelected: "4", // TODO dans fichier de configuration
  weekStructure: null,
  error: null,
};

export default function WeekStructureReducer(state = initialState, action) {
  switch (action.type) {
    //Initialize week contents
    case INIT_DATE_BEGIN:
      return {
        ...state,
        error: null,
      };

    case INIT_DATE_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.selectedWeek,
      };
    case INIT_WEEKSTRUCTURE_BEGIN:
      return {
        ...state,
        error: null,
      };

    case INIT_WEEKSTRUCTURE_SUCCESS:
      return {
        ...state,
        weekStructure: action.payload.weekStructure,
      };
    case INIT_WEEKSTRUCTURE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    // Select Regim:
    case UPDATE_REGIME_BEGIN:
      return {
        ...state,
      };
    case UPDATE_REGIME_SUCCESS:
      return {
        ...state,
        regimeSelected: action.payload.regimeId,
      };
    // Date navigation:
    case PREVIOUS_MONTH_BEGIN:
      return {
        ...state,
        error: null,
      };
    case PREVIOUS_MONTH_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update,
      };
    case NEXT_MONTH_BEGIN:
      return {
        ...state,
        error: null,
      };
    case NEXT_MONTH_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update,
      };
    case PREVIOUS_WEEK_BEGIN:
      return {
        ...state,
        error: null,
      };
    case PREVIOUS_WEEK_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update,
      };

    case NEXT_WEEK_BEGIN:
      return {
        ...state,
        error: null,
      };
    case NEXT_WEEK_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update,
      };
    case PREVIOUS_MONTH_LAST_WEEK_BEGIN:
      return {
        ...state,
        error: null,
      };
    case PREVIOUS_MONTH_LAST_WEEK_SUCCESS:
      return {
        ...state,
        selectedWeek: action.payload.update,
      };
    // *** Update week contents
    case UPDATE_WEEKSTRUCTURE_BEGIN:
      return {
        ...state,
        error: null,
      };

    case UPDATE_WEEKSTRUCTURE_SUCCESS:
      return {
        ...state,
        weekStructure: action.payload.update,
      };

    case UPDATE_WEEKSTRUCTURE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    case UPDATE_FOLDING_BEGIN:
      return {
        ...state,
        error: null,
      };

    case UPDATE_FOLDING_SUCCESS:
      return {
        ...state,
        weekStructure: action.payload.update,
      };
    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
