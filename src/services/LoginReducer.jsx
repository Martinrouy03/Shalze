import {
  LOG_USER_BEGIN,
  LOG_USER_SUCCESS,
  LOG_USER_FAILURE,
  LOG_USER_WRONG_LOGIN,
  LOGOUT_USER_BEGIN,
  LOGOUT_USER_FAILURE,
  LOGOUT_USER_SUCCESS,
  MODAL_OUT,
} from "./LoginActions";

const initialState = {
  user: { code: "", token: "", username: "" },
  isLogged: false,
  modalClose: false,
  loading: false,
  error: null,
};

export default function LoginReducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_OUT:
      return { ...state, modalClose: true };
    case LOG_USER_BEGIN:
      return {
        ...state,
        loading: true,
        modalClose: false,
        error: null,
      };

    case LOG_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        modalClose: true,
        user: action.payload.user,
        isLogged: true,
      };

    case LOG_USER_FAILURE:
      return {
        ...state,
        loading: false,
        modalClose: true,
        error: action.payload.error,
      };
    case LOG_USER_WRONG_LOGIN:
      return {
        ...state,
        loading: false,
        modalClose: false,
        error: action.payload.error,
      };

    case LOGOUT_USER_BEGIN:
      return {
        ...state,
        loading: true,
        isLogged: true,
        error: null,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        modalClose: true,
        user: { code: "", username: "", token: "" },
        isLogged: false,
      };
    case LOGOUT_USER_FAILURE:
      return {
        ...state,
        loading: false,
        modalClose: false,
        error: action.payload.error,
      };
    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
