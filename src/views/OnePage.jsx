// Import Libraries
import { useState, useEffect } from "react";
import { useDispatch, shallowEqual, useSelector } from "react-redux";

// Import Views
import Header from "../views/Header";
import LoginModal from "../views/LoginModal";
import SelectWeek from "./SelectWeek";
import DisplayWeek from "./DisplayWeek";
import DisplayRegimes from "./DisplayRegimes";

// Import Actions
import { getOrder } from "../services/OrderActions";
import { getPlaces } from "../services/PlacesActions";
import { getRegimes } from "../services/RegimesActions";
import { getConfiguration } from "../services/ConfigurationActions";
import {
  initDate,
  initWeekStructure,
  updateWeekStructure,
} from "../services/WeekStructureActions";
import { convertUnixToDate } from "../utils/functions";

let token = localStorage.getItem("token") || "";
const userId = localStorage.getItem("userId") || "";

// State instantiations:
const navLanguage = navigator.language || navigator.userLanguage;
let initLang = "";
if (navLanguage.includes("fr")) {
  initLang = "FR";
} else {
  initLang = "EN";
}

const OnePage = () => {
  const dispatch = useDispatch();
  const [lang, setLang] = useState(initLang);
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  const orderReducer = useSelector((state) => state.orderReducer);
  const weekReducer = useSelector((state) => state.weekStructureReducer);
  const modalClose = useSelector((state) => state.loginReducer.modalClose);
  const loginReducer = useSelector((state) => state.loginReducer);
  const places = useSelector((state) => state.placesReducer.places);
  const regimesReducer = useSelector((state) => state.regimesReducer);
  // monthEnd = monthEnd.toLocaleDateString();
  useEffect(() => {
    dispatch(getConfiguration());
    dispatch(initDate());
    dispatch(getPlaces(token));
    dispatch(getRegimes(token));
  }, []);
  useEffect(() => {
    config.codeRepas && dispatch(getOrder(userId, token));
  }, [token, modalClose, loginReducer, config]);
  useEffect(() => {
    places[0] && dispatch(initWeekStructure());
    places[0] &&
      Object.keys(orderReducer.order).includes("lines") &&
      regimesReducer.list.length > 0 &&
      dispatch(
        updateWeekStructure(orderReducer.order.lines, regimesReducer.list)
      );
  }, [orderReducer.order, regimesReducer.list]);
  useEffect(() => {
    config.codeRepas &&
      Object.keys(orderReducer.order).includes("lines") &&
      regimesReducer.list.length > 0 &&
      dispatch(
        updateWeekStructure(orderReducer.order.lines, regimesReducer.list)
      );
  }, [weekReducer.selectedWeek]);
  return (
    <div>
      <Header lang={lang} setLang={setLang} initLang={initLang} token={token} />

      {!modalClose && config.language && !token && <LoginModal lang={lang} />}
      <div className="center">
        {loginReducer.error && loginReducer.error.code === "ERR_NETWORK" && (
          <h2>{config.language[lang].serverOff}</h2>
        )}
        {loginReducer.error && loginReducer.error === 202 && (
          <h2>{config.language[lang].status202}</h2>
        )}
        {loginReducer.error && loginReducer.error === 404 && (
          <h2>{config.language[lang].userNotFound}</h2>
        )}
        {orderReducer.error && orderReducer.error.status === 404 && (
          <h2>{config.language[lang].orderNotFound}</h2>
        )}
      </div>
      {orderReducer.loading ? (
        <div className="center">En cours de chargement...</div>
      ) : (
        <>
          <div className="center">
            {config.language && <DisplayRegimes lang={lang} />}
            {weekReducer.selectedWeek && <SelectWeek lang={lang} />}
          </div>
          <div className="centerColumn">
            {!orderReducer.loading &&
              weekReducer.weekStructure &&
              weekReducer.selectedWeek && <DisplayWeek lang={lang} />}
          </div>
        </>
      )}
    </div>
  );
};

export default OnePage;
