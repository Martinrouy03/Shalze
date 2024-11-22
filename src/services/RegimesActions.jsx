import { const_apiurl } from "../Constant.js";
import axios from "axios";

export function getRegimes(token) {
  return (dispatch) => {
    console.log("getRegimesBegin");
    dispatch(getRegimesBegin());
    return axios
      .get(
        const_apiurl + "dklaccueil/dictionary/mealTypes" + "?DOLAPIKEY=" + token
      )
      .then((json) => {
        console.log("getRegimesSuccess");
        dispatch(getRegimesSuccess(json.data));
      })
      .catch((error) => {
        console.log("getRegimesFailure");
        // *** an 404 error is sent when Dolibarr didn't find invoices
        if (error.response) {
          // *** It's a Dolibarr error
          if (error.response.status === 404) dispatch(getRegimesSuccess());
          else
            dispatch(
              getRegimesFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
        } else {
          // *** It's an API error
          dispatch(getRegimesFailure(error));
        }
      });
  };
}
export const GET_REGIMES_BEGIN = "GET_REGIMES_BEGIN";
export const GET_REGIMES_SUCCESS = "GET_REGIMES_SUCCESS";
export const GET_REGIMES_FAILURE = "GET_REGIMES_FAILURE";

export const getRegimesBegin = () => ({
  type: GET_REGIMES_BEGIN,
});

export const getRegimesSuccess = (list) => ({
  type: GET_REGIMES_SUCCESS,
  payload: { list },
});

export const getRegimesFailure = (error) => ({
  type: GET_REGIMES_FAILURE,
  payload: { error },
});

export function updateRegime(regimeId) {
  return (dispatch) => {
    dispatch(updateRegimeBegin());
    console.log("updateRegime Begin!");
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
  payload: regimeId,
});
