import {
  GET_REGIMES_BEGIN,
  GET_REGIMES_FAILURE,
  GET_REGIMES_SUCCESS,
  UPDATE_REGIME_BEGIN,
  UPDATE_REGIME_SUCCESS,
} from "./RegimesActions";

const initialState = [];

export default function RegimesReducer(state = initialState, action) {
  switch (action.type) {
    // *** Get Order
    case GET_REGIMES_BEGIN:
      return {
        ...state,
        list: [],
        selected: "4",
        loading: true,
        error: null,
      };

    case GET_REGIMES_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.list,
      };

    case GET_REGIMES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case UPDATE_REGIME_BEGIN:
      return {
        ...state,
      };
    case UPDATE_REGIME_SUCCESS:
      return {
        ...state,
        selected: action.payload.regimeId,
      };

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
