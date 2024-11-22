import {
  INIT_WEEKSTRUCTURE_BEGIN,
  INIT_WEEKSTRUCTURE_SUCCESS,
  INIT_WEEKSTRUCTURE_FAILURE,
  UPDATE_WEEKSTRUCTURE_BEGIN,
  UPDATE_WEEKSTRUCTURE_SUCCESS,
  UPDATE_WEEKSTRUCTURE_FAILURE,
} from "./WeekStructureActions";

const initialState = {
  month: "",
  week: "",
  weekStructure: null,
  error: null,
};

export default function WeekStructureReducer(state = initialState, action) {
  switch (action.type) {
    // *** Update week contents
    case INIT_WEEKSTRUCTURE_BEGIN:
      return {
        ...state,
        error: null,
      };

    case INIT_WEEKSTRUCTURE_SUCCESS:
      return {
        ...state,
        weekStructure: action.payload.initWeekStructure,
      };

    case INIT_WEEKSTRUCTURE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    case UPDATE_WEEKSTRUCTURE_BEGIN:
      return {
        ...state,
        error: null,
      };

    case UPDATE_WEEKSTRUCTURE_SUCCESS:
      return {
        ...state,
        weekStructure: action.payload.weekStructure,
      };

    case UPDATE_WEEKSTRUCTURE_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
