import { getDateValue } from "../services/DateActions";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronRight,
  faChevronLeft,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertDateToUnix } from "../utils/functions";
import {
  previousMonthLastWeek,
  previousMonth,
  nextMonth,
  previousWeek,
  nextWeek,
} from "../services/DateActions";
library.add(faChevronRight, faChevronLeft, faChevronDown);

const SelectWeek = ({ lang }) => {
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(0);
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  const commandNb = useSelector((state) => state.orderReducer.order.commandNb);
  const dateReducer = getDateValue();
  const currentMonth = dateReducer.currentMonth;
  const selectedMonth = dateReducer.selectedMonth;
  const currentWeek = dateReducer.currentWeek;

  let monthStart = new Date(selectedMonth.year, selectedMonth.month, 1);
  monthStart = convertDateToUnix(monthStart);
  return (
    <div>
      <div className="center">
        {monthStart > currentWeek.weekStart && (
          <FontAwesomeIcon
            id="chevron"
            onClick={() => {
              dispatch(previousMonth());
              setCounter(counter - 1);
            }}
            icon="fa-solid fa-chevron-left"
            size="xl"
          />
        )}
        <h1>
          {config.language && config.language[lang].month[selectedMonth.month]}
        </h1>

        <FontAwesomeIcon
          id="chevron"
          onClick={() => {
            if (counter === commandNb - 1) {
              //TODO
              console.log("Pas de commande pour le mois prochain");
            } else {
              dispatch(nextMonth());
              setCounter(counter + 1);
            }
          }}
          icon="fa-solid fa-chevron-right"
          size="xl"
        />
      </div>
      <div className="center">
        {!(
          selectedMonth.month === currentMonth.month &&
          selectedMonth.nbWeeksSinceMonthStart === 0
        ) && (
          <FontAwesomeIcon
            id="chevron"
            onClick={() => {
              if (selectedMonth.nbWeeksSinceMonthStart > 0) {
                dispatch(previousWeek());
              } else {
                dispatch(previousMonthLastWeek());
                setCounter(counter - 1);
              }
            }}
            icon="fa-solid fa-chevron-left"
            size="xl"
          />
        )}
        <h1>{config.language && config.language[lang].week}</h1>
        <FontAwesomeIcon
          id="chevron"
          onClick={() => {
            if (selectedMonth.nbWeeksBeforeMonthEnd > 0) {
              dispatch(nextWeek());
            } else if (selectedMonth.nbWeeksBeforeMonthEnd === 0) {
              if (counter === commandNb - 1) {
                console.log("Pas de commande !!");
                //TODO
                // Add ErrorReducer;
                // Display error Message : config.NoCommand => Pas de commande pour le mois prochain
              } else {
                dispatch(nextMonth());
                setCounter(counter + 1);
              }
            }
          }}
          icon="fa-solid fa-chevron-right"
          size="xl"
        />
      </div>
    </div>
  );
};

export default SelectWeek;
