import { useSelector, useDispatch } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronRight,
  faChevronLeft,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  previousMonth,
  nextMonth,
  previousWeek,
  previousMonthLastWeek,
  nextWeek,
} from "../services/WeekStructureActions";
library.add(faChevronRight, faChevronLeft, faChevronDown);

const SelectWeek = ({ lang }) => {
  const dispatch = useDispatch();
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  const commandNb = useSelector((state) => state.orderReducer.commandNb);
  const selectedWeek = useSelector(
    (state) => state.weekStructureReducer.selectedWeek
  );
  return (
    <div>
      <div className="center">
        {!(selectedWeek.month === new Date().getMonth()) && (
          <FontAwesomeIcon
            id="chevron"
            onClick={() => {
              dispatch(previousMonth());
            }}
            icon="fa-solid fa-chevron-left"
            size="xl"
          />
        )}
        <h1>
          {config.language && config.language[lang].month[selectedWeek.month]}
        </h1>

        <FontAwesomeIcon
          id="chevron"
          onClick={() => {
            if (selectedWeek.monthCounter === commandNb - 1) {
              // TODO: check here
              console.log("Pas de commande pour le mois prochain");
            } else {
              dispatch(nextMonth());
            }
          }}
          icon="fa-solid fa-chevron-right"
          size="xl"
        />
      </div>
      <div className="center">
        {selectedWeek.weekStart > selectedWeek.weekStartAbsolute && (
          <FontAwesomeIcon
            id="chevron"
            onClick={() => {
              if (selectedWeek.nbWeeksSinceMonthStart > 0) {
                dispatch(previousWeek());
              } else {
                dispatch(previousMonthLastWeek());
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
            if (selectedWeek.nbWeeksBeforeMonthEnd > 0) {
              dispatch(nextWeek());
            } else if (selectedWeek.nbWeeksBeforeMonthEnd === 0) {
              if (selectedWeek.monthCounter === commandNb - 1) {
                console.log("Pas de commande !!");
                //TODO: create error message!!
                // Add ErrorReducer;
                // Display error Message : config.NoCommand => Pas de commande pour le mois prochain
              } else {
                dispatch(nextMonth());
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
