import { const_apiurl } from "../Constant.js";
import axios from "axios";
import moment from "moment";
import { getConfigurationValue } from "./ConfigurationActions.jsx";

export function getOrder() {
  const customerID = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  // const currentMonth = new Date().getMonth();
  // const month = currentMonth;
  let codeRepas = getConfigurationValue("codeRepas");
  codeRepas = codeRepas.code;
  return (dispatch) => {
    console.log("getOrderBegin : Customer " + customerID);
    dispatch(getOrderBegin());
    return axios
      .get(
        const_apiurl +
          "orders?sortfield=t.rowid&sortorder=ASC&limit=300&thirdparty_ids=" +
          customerID +
          "&DOLAPIKEY=" +
          token
      )
      .then((json) => {
        console.log("getOrderSuccess");
        let orders = json.data.filter(
          (order) => order.lines.length > 0 //&&
        );
        orders = orders.filter((order) =>
          order.lines.some(
            (line) =>
              line.ref === codeRepas &&
              new Date(moment.unix(line.array_options.options_lin_datefin)) >=
                new Date()
          )
        );

        const commandNb = orders.length;
        // console.log("commandNb: ", commandNb);

        const order = orders.filter(
          (order) =>
            new Date(
              moment.unix(order.lines[0].array_options.options_lin_datedebut) //
            ).getMonth() === new Date().getMonth()
        );
        // dispatch(getOrderSuccess(order[0]));
        dispatch(
          getOrderSuccess({
            order: order[0],
            commandNb: commandNb,
            // currentMonth: currentMonth,
          })
        );

        // *** Reload the customer : if there were changes in the order, the copy of the order in the customer is updated. Usefull for function such as getMealforadate etc
      })
      .catch((error) => {
        console.log("getOrderFailure");
        if (error.response) {
          // *** It's a Dolibarr error
          console.log("Status: ", error.response.status);
          if (error.response.status === 404) {
            console.log("No order found for this thirdparty ID!");
            dispatch(getOrderFailure(error));
          } else
            dispatch(
              getOrderFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
        } else {
          // *** It's an API error
          dispatch(getOrderFailure(error));
        }
      });
  };
}

export const GET_ORDER_BEGIN = "GET_ORDER_BEGIN";
export const GET_ORDER_SUCCESS = "GET_ORDER_SUCCESS";
export const GET_ORDER_FAILURE = "GET_ORDER_FAILURE";

export const getOrderBegin = () => ({
  type: GET_ORDER_BEGIN,
});

export const getOrderSuccess = (output) => ({
  type: GET_ORDER_SUCCESS,
  payload: { output },
});

export const getOrderFailure = (error) => ({
  type: GET_ORDER_FAILURE,
  payload: { error },
});

export function updateOrderLine(
  orderId,
  orderLineId,
  orderLine,
  customerID,
  month,
  token
) {
  return (dispatch) => {
    console.log("updateOrderLineBegin : " + orderLineId);
    dispatch(updateOrderLineBegin());
    return axios
      .put(
        const_apiurl +
          "orders/" +
          orderId +
          "/lines/" +
          orderLineId +
          "?DOLAPIKEY=" +
          token,
        orderLine
      )
      .then((json) => {
        console.log("updateOrderLineSuccess");
        // *** Reload order
        dispatch(getOrder(customerID, month, "", token));
      })
      .catch((error) => {
        console.log("updateOrderLineFailure");
        if (error.response) {
          if (error.response.data === 404) {
            dispatch(
              updateOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
            // Reload Order
            dispatch(getOrder(orderId, "", "", token));
          } else {
            dispatch(
              updateOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
          }
        } else {
          // *** It's an API error
          dispatch(updateOrderLineFailure(error));
        }
      });
  };
}

export const UPDATE_ORDERLINE_BEGIN = "UPDATE_ORDERLINE_BEGIN";
export const UPDATE_ORDERLINE_SUCCESS = "UPDATE_ORDERLINE_SUCCESS";
export const UPDATE_ORDERLINE_FAILURE = "UPDATE_ORDERLINE_FAILURE";

export const updateOrderLineBegin = () => ({
  type: UPDATE_ORDERLINE_BEGIN,
});
export const updateOrderLineSuccess = (orderLineId) => ({
  type: UPDATE_ORDERLINE_SUCCESS,
  payload: { orderLineId },
});
export const updateOrderLineFailure = (error) => ({
  type: UPDATE_ORDERLINE_FAILURE,
  payload: { error },
});

// ---------------- ADD ORDERLINE ----------------- //

export function addOrderLine(order, month, orderline, token) {
  return (dispatch) => {
    console.log("addOrderLineBegin " + order.id);
    dispatch(addOrderLineBegin());
    return axios
      .post(
        const_apiurl + "orders/" + order.id + "/lines" + "?DOLAPIKEY=" + token,
        {
          fk_product: orderline.fk_product,
          label: orderline.label,
          array_options: orderline.array_options,
          qty: orderline.qty,
          subprice: orderline.subprice,
        }
      )
      .then((json) => {
        console.log("addOrderLineSuccess");
        dispatch(addOrderLineSuccess(json.data)); // TODO: Check if necessary
        // *** Reload order
        dispatch(getOrder(order.socid, month, "", token));
      })
      .catch((error) => {
        // *** an 404 error is sent when Dolibarr didn't find invoices
        console.log("addOrderLineFailure");
        if (error.response) {
          if (error.response.status === 404) {
            dispatch(
              addOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );

            // *** Reload order
            dispatch(getOrder(order.id, "", "", token));
          } else {
            dispatch(
              addOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
          }
        } else {
          // *** It's an API error
          dispatch(addOrderLineFailure(error));
        }
      });
  };
}

export const ADD_ORDERLINE_BEGIN = "ADD_ORDERLINE_BEGIN";
export const ADD_ORDERLINE_SUCCESS = "ADD_ORDERLINE_SUCCESS";
export const ADD_ORDERLINE_FAILURE = "ADD_ORDERLINE_FAILURE";

export const addOrderLineBegin = () => ({
  type: ADD_ORDERLINE_BEGIN,
});

export const addOrderLineSuccess = (orderlineid) => ({
  type: ADD_ORDERLINE_SUCCESS,
  payload: { orderlineid },
});

export const addOrderLineFailure = (error) => ({
  type: ADD_ORDERLINE_FAILURE,
  payload: { error },
});

// --------- DELETE ORDERLINE ----------- //

export function removeOrderLine(
  orderId,
  orderLineid,
  customerID,
  month,
  token
) {
  return (dispatch) => {
    console.log("removeOrderLineBegin : " + orderId + " -" + orderLineid);

    dispatch(removeOrderLineBegin());
    return axios
      .post(
        const_apiurl +
          "dklaccueil/" +
          orderId +
          "/deleteOrderLine/" +
          orderLineid +
          "?DOLAPIKEY=" +
          token,
        {
          params: {
            id: orderId,
            lineid: orderLineid,
          },
        }
      )
      .then((json) => {
        console.log("removeOrderLineSuccess");
        dispatch(removeOrderLineSuccess(json.data));

        // *** Reload order
        dispatch(getOrder(customerID, month, "", token));
      })
      .catch((error) => {
        console.log("removeOrderLineFailure");
        // *** an 404 error is sent when Dolibarr didn't find invoices
        if (error.response) {
          if (error.response.status === 404) {
            dispatch(removeOrderLineFailure(error.response.data.error));

            // // *** Reload order
            // dispatch(getOrder(orderId));
          } else {
            dispatch(
              removeOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
          }
        } else {
          // *** It's an API error
          dispatch(removeOrderLineFailure(error));
        }
      });
  };
}

export const REMOVE_ORDERLINE_BEGIN = "REMOVE_ORDERLINE_BEGIN";
export const REMOVE_ORDERLINE_SUCCESS = "REMOVE_ORDERLINE_SUCCESS";
export const REMOVE_ORDERLINE_FAILURE = "REMOVE_ORDERLINE_FAILURE";

export const removeOrderLineBegin = () => ({
  type: REMOVE_ORDERLINE_BEGIN,
});

export const removeOrderLineSuccess = () => ({
  type: REMOVE_ORDERLINE_SUCCESS,
  payload: {},
});

export const removeOrderLineFailure = (error) => ({
  type: REMOVE_ORDERLINE_FAILURE,
  payload: { error },
});

// ----------- SPLIT LINE INTO TWO -----------------//

export function orderBreakLine(
  order,
  orderline,
  breakDate,
  isBridgeLine,
  month,
  token
) {
  return (dispatch) => {
    console.log("setorderBreakLine :  " + orderline.id);
    const newEndDate = breakDate - 24 * 3600;

    // *** Create a deep copy to modify the current line
    const locOrderLine = {
      ...orderline,
      array_options: { ...orderline.array_options },
    };
    const endDate = locOrderLine.array_options.options_lin_datefin;

    // *** Compute the line to be modfied
    let diffInDays =
      Math.floor(
        (newEndDate - locOrderLine.array_options.options_lin_datedebut) /
          (60 * 60 * 24)
      ) + 1;
    locOrderLine.array_options.options_lin_datefin = newEndDate;
    locOrderLine.qty = diffInDays;

    /** Create the new line */
    let newStartDate = breakDate;
    if (isBridgeLine) {
      newStartDate = breakDate + 7 * 24 * 3600;
    } else {
      newStartDate = breakDate + 1 * 24 * 3600;
    }
    // let newStartDate = breakDate + 24 * 3600;
    let diffInDays2 = (endDate - newStartDate) / (60 * 60 * 24) + 1;
    /** Send to database */
    dispatch(
      updateOrderLineandAddOrderline(
        order.id,
        locOrderLine.id,
        locOrderLine,
        month,
        order,
        {
          fk_product: locOrderLine.fk_product,
          label: locOrderLine.label,
          array_options: {
            options_lin_datedebut: newStartDate,
            options_lin_datefin: endDate,
            options_lin_room: orderline.array_options.options_lin_room,
            options_lin_intakeplace:
              orderline.array_options.options_lin_intakeplace,
          },
          qty: String(diffInDays2),
          subprice: orderline.subprice,
        },
        token
      )
    );
  };
}

export const SET_ORDERBREAKLINE_BEGIN = "SET_ORDERBREAKLINE_BEGIN";
export const SET_ORDERBREAKLINE_SUCCESS = "SET_ORDERBREAKLINE_SUCCESS";
export const SET_ORDERBREAKLINE_FAILURE = "SET_ORDERBREAKLINE_FAILURE";

export const setorderBreakLineBegin = () => ({
  type: SET_ORDERBREAKLINE_BEGIN,
});

export const setorderBreakLineSuccess = () => ({
  type: SET_ORDERBREAKLINE_SUCCESS,
  payload: {},
});

export const setorderBreakLineFailure = (error) => ({
  type: SET_ORDERBREAKLINE_FAILURE,
  payload: { error },
});

// *****************************************************************************************
/** Update an order line d add a new line 
 * use by the break meal line
* @param {*} orderid 
* @param {*} orderLineid : orderline id to be updated
* @param {*} orderline : data to fill the order to be updated
* @param {*} order
* @param {*} addStruct : data to fill the order to be created

*/
export function updateOrderLineandAddOrderline(
  orderid,
  orderLineid,
  orderline,
  month,
  order,
  addStruct,
  token
) {
  return (dispatch) => {
    console.log("updateOrderLineandAddOrderlineBegin " + orderLineid);

    dispatch(updateOrderLineandAddOrderlineBegin());

    return axios
      .put(
        const_apiurl +
          "orders/" +
          orderid +
          "/lines/" +
          orderLineid +
          "?DOLAPIKEY=" +
          token,
        orderline
      )
      .then((json) => {
        console.log("updateOrderLineandAddOrderlineSuccess");
        dispatch(updateOrderLineandAddOrderlineSuccess(json.data));

        dispatch(addOrderLine(order, month, addStruct, token));
        // *** Reload order
        dispatch(getOrder(order.socid, month, "", token));
      })
      .catch((error) => {
        // *** an 404 error is sent when Dolibarr didn't find invoices
        console.log("updateOrderLineandAddOrderlineFailure");
        if (error.response) {
          if (error.response.status === 404) {
            dispatch(
              updateOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );

            // *** Reload order
            dispatch(getOrder(orderid, "", "", token));
          } else {
            dispatch(
              updateOrderLineFailure({
                code: error.response.status,
                message:
                  error.response.status + " " + error.response.statusText,
              })
            );
          }
        } else {
          // *** It's an API error
          dispatch(updateOrderLineandAddOrderlineFailure(error));
        }
      });
  };
}

export const UPDATE_ORDERLINEANDADDORDERLINE_BEGIN =
  "UPDATE_ORDERLINEANDADDORDERLINE_BEGIN";
export const UPDATE_ORDERLINEANDADDORDERLINE_SUCCESS =
  "UPDATE_ORDERLINEANDADDORDERLINE_SUCCESS";
export const UPDATE_ORDERLINEANDADDORDERLINE_FAILURE =
  "UPDATE_ORDERLINEANDADDORDERLINE_FAILURE";

export const updateOrderLineandAddOrderlineBegin = () => ({
  type: UPDATE_ORDERLINEANDADDORDERLINE_BEGIN,
});

export const updateOrderLineandAddOrderlineSuccess = (orderlineid) => ({
  type: UPDATE_ORDERLINEANDADDORDERLINE_SUCCESS,
  payload: { orderlineid },
});

export const updateOrderLineandAddOrderlineFailure = (error) => ({
  type: UPDATE_ORDERLINEANDADDORDERLINE_FAILURE,
  payload: { error },
});
