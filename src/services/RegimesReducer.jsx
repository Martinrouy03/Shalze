import {
  GET_REGIMES_BEGIN,
  GET_REGIMES_FAILURE,
  GET_REGIMES_SUCCESS,
  // UPDATE_REGIME_BEGIN,
  // UPDATE_REGIME_SUCCESS,
} from "./RegimesActions";

const initialState = [];

export default function RegimesReducer(state = initialState, action) {
  switch (action.type) {
    // *** Get Order
    case GET_REGIMES_BEGIN:
      return {
        ...state,
        list: [],
        // selected: "4",
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

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
