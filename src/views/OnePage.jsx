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
import { initDate } from "../services/DateActions";
import { getOrder } from "../services/OrderActions";
import { getPlaces } from "../services/PlacesActions";
import { getRegimes } from "../services/RegimesActions";
import { getConfiguration } from "../services/ConfigurationActions";
import {
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
  const orderReducer = useSelector((state) => state.orderReducer.order);
  const weekStructure = useSelector(
    (state) => state.weekStructureReducer.weekStructure
  );
  const dateReducer = useSelector((state) => state.dateReducer);
  const modalClose = useSelector((state) => state.loginReducer.modalClose);
  const loginReducer = useSelector((state) => state.loginReducer);
  const places = useSelector((state) => state.placesReducer.places);
  // const regimesReducer = useSelector((state) => state.regimesReducer);
  let monthEnd = convertUnixToDate(dateReducer.selectedMonth.monthEnd);
  monthEnd = monthEnd.toLocaleDateString();
  useEffect(() => {
    dispatch(getConfiguration());
    token && dispatch(getPlaces(token));
    token && dispatch(getRegimes(token));
    dispatch(initDate());
  }, []);

  useEffect(() => {
    token && config.codeRepas && dispatch(getOrder(userId, token));
  }, [token, modalClose, loginReducer, config]);

  useEffect(() => {
    places[0] && dispatch(initWeekStructure());
  }, [places]);

  useEffect(() => {
    orderReducer.order &&
      weekStructure &&
      config.codeRepas &&
      dispatch(
        updateWeekStructure(
          orderReducer.order,
          weekStructure,
          config.codeRepas.code
        )
      );
  }, [weekStructure, dateReducer]);

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
      <div className="center">
        {config.language && <DisplayRegimes lang={lang} />}
        {dateReducer.todayDate && <SelectWeek lang={lang} />}
      </div>
      <div className="centerColumn">
        <DisplayWeek lang={lang} />
        {/* <h2>Current Month</h2>
        <h3>Max Weeks: {dateReducer.currentMonth.maxWeek}</h3>
        <h3>Mois: {dateReducer.currentMonth.month}</h3> */}
      </div>
      <div className="centerColumn">
        <h2>Selected Week</h2>

        <h3>
          nb de semaines avant la fin du mois:{" "}
          {dateReducer.selectedMonth.nbWeeksBeforeMonthEnd}
        </h3>
        <h3>
          nb de semaines depuis début du mois:{" "}
          {dateReducer.selectedMonth.nbWeeksSinceMonthStart}
        </h3>
        <h3>Mois: {dateReducer.selectedMonth.month}</h3>
        <h3>
          Début de semaine:{" "}
          {convertUnixToDate(
            dateReducer.selectedWeek.weekStart
          ).toLocaleDateString()}
        </h3>
        <h3>Mois: {dateReducer.selectedMonth.month}</h3>
      </div>
      <div className="centerColumn">
        <h2>Dernier du mois</h2>
        <h3>{monthEnd}</h3>
      </div>
    </div>
  );
};

export default OnePage;
