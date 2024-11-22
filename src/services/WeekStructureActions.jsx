// import { getPlacesValue } from "./PlacesActions";

export function initWeekStructure() {
  return (dispatch) => {
    console.log("initWeekStructureBegin ");
    dispatch(initWeekStructureBegin());
    // const places = getPlacesValue();
    let initWeekStructure = {
      placeLabel: "",
      placeCode: "",
      breakfast: Array(7).fill({
        regime: "",
        booked: 0,
        disabled: 0,
      }),
      lunch: Array(7).fill({
        regime: "",
        booked: 0,
        disabled: 0,
      }),
      dinner: Array(7).fill({
        regime: "",
        booked: 0,
        disabled: 0,
      }),
    };

    dispatch(initWeekStructureSuccess(initWeekStructure));
    console.log("initWeekStructureSuccess!");
  };
}

export const INIT_WEEKSTRUCTURE_BEGIN = "INIT_WEEKSTRUCTURE_BEGIN";
export const INIT_WEEKSTRUCTURE_SUCCESS = "INIT_WEEKSTRUCTURE_SUCCESS";
export const INIT_WEEKSTRUCTURE_FAILURE = "INIT_WEEKSTRUCTURE_FAILURE";

export const initWeekStructureBegin = () => ({
  type: INIT_WEEKSTRUCTURE_BEGIN,
});
export const initWeekStructureSuccess = (initWeekStructure) => ({
  type: INIT_WEEKSTRUCTURE_SUCCESS,
  payload: { initWeekStructure },
});
export const initWeekStructureFailure = (error) => ({
  type: INIT_WEEKSTRUCTURE_FAILURE,
  payload: { error },
});

export function updateWeekStructure(order, weekStructure, codeRepas) {
  return (dispatch) => {
    console.log("updateWeekStructureBegin");
    dispatch(updateWeekStructureBegin());
    const orderLines = order.lines.filter(
      (orderLine) => orderLine.product_ref !== codeRepas
    );
    // console.log("orderLines: ", orderLines);
    // console.log("weekStructure: ", weekStructure);
  };
}

export const UPDATE_WEEKSTRUCTURE_BEGIN = "UPDATE_WEEKSTRUCTURE_BEGIN";
export const UPDATE_WEEKSTRUCTURE_SUCCESS = "UPDATE_WEEKSTRUCTURE_SUCCESS";
export const UPDATE_WEEKSTRUCTURE_FAILURE = "UPDATE_WEEKSTRUCTURE_FAILURE";

export const updateWeekStructureBegin = () => ({
  type: UPDATE_WEEKSTRUCTURE_BEGIN,
});
export const updateWeekStructureSuccess = (updatedWeekStructure) => ({
  type: UPDATE_WEEKSTRUCTURE_SUCCESS,
  payload: { updatedWeekStructure },
});
export const updateWeekStructureFailure = (error) => ({
  type: UPDATE_WEEKSTRUCTURE_FAILURE,
  payload: { error },
});
