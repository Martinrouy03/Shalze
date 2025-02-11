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
        if (typeof json.data === "object") {
          dispatch(getRegimesSuccess(json.data));
          console.log("getRegimesSuccess");
        } else {
          dispatch(
            getRegimesFailure({
              code: 404,
              message: "Server not Found",
            })
          );
          console.log("getRegimesFailure");
        }
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
