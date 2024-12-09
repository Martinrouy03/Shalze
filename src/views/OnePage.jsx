// Import Libraries
import { useState, useEffect } from "react";
import { useDispatch, shallowEqual, useSelector } from "react-redux";

// Import Views
import Header from "../views/Header";
import LoginModal from "../views/LoginModal";
import SelectWeek from "./SelectWeek";
import DisplayWeek from "./DisplayWeek";
import DisplayRegimes from "./DisplayRegimes";
import ErrorMessages from "./ErrorMessages";

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

// State instantiations:
const navLanguage = navigator.language || navigator.userLanguage;
let initLang = "";
if (navLanguage.includes("fr")) {
  initLang = "FR";
} else {
  initLang = "EN";
}

const OnePage = () => {
  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("userId") || "";

  const dispatch = useDispatch();
  const [lang, setLang] = useState(initLang);
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  const orderReducer = useSelector((state) => state.orderReducer);
  const weekReducer = useSelector((state) => state.weekStructureReducer);
  const loginReducer = useSelector((state) => state.loginReducer);
  const places = useSelector((state) => state.placesReducer.places);
  const regimesReducer = useSelector((state) => state.regimesReducer);
  useEffect(() => {
    dispatch(getConfiguration());
    dispatch(initDate());
    token && dispatch(getPlaces(token));
    token && dispatch(getRegimes(token));
  }, [token]);
  useEffect(() => {
    token && userId && config.codeRepas && dispatch(getOrder());
  }, [loginReducer.modalClose, config, userId]);
  useEffect(() => {
    places[0] && dispatch(initWeekStructure());
    places[0] &&
      Object.keys(orderReducer.order).includes("lines") &&
      regimesReducer.list.length > 0 &&
      dispatch(
        updateWeekStructure(orderReducer.order.lines, regimesReducer.list)
      );
  }, [orderReducer.order, regimesReducer.list, places]);
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
      <ErrorMessages lang={lang} />
      {config.language && !loginReducer.modalClose && !token && (
        <LoginModal lang={lang} />
      )}
      {!token ? (
        <div className="center">{config.language[lang].signinMessage}</div>
      ) : orderReducer.loading ? (
        <div className="center">En cours de chargement...</div>
      ) : (
        <>
          <div className="center">
            {config.language && <DisplayRegimes lang={lang} />}
            {weekReducer.selectedWeek && orderReducer.order && (
              <SelectWeek lang={lang} />
            )}
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
