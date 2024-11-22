import { store } from "../app/App";
import { convertUnixToDate } from "../utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DisplayWeekDates = ({ lang, place }) => {
  const config = store.getState().configurationReducer.configuration;
  const dateReducer = store.getState().dateReducer;
  const weekStart = convertUnixToDate(dateReducer.selectedWeek.weekStart);
  const monthDay = weekStart.getDate();
  return (
    <>
      <div>
        <div></div>
        <div>{config.language[lang].weekDay[0]}</div>
        <div>{config.language[lang].weekDay[1]}</div>
        <div>{config.language[lang].weekDay[2]}</div>
        <div>{config.language[lang].weekDay[3]}</div>
        <div>{config.language[lang].weekDay[4]}</div>
        <div>{config.language[lang].weekDay[5]}</div>
        <div>{config.language[lang].weekDay[6]}</div>
      </div>
      <div>
        <div id="placeLabel">
          <h2>{place.label}</h2>
          <FontAwesomeIcon
            id="chevron"
            onClick={() => {
              //   handleFolding(indexPlace, isUnFolded);
            }}
            icon="fa-solid fa-chevron-down"
            size="xl"
          />
        </div>
        <div>{new Date(weekStart.setDate(monthDay)).getDate()}</div>
        <div>{new Date(weekStart.setDate(monthDay + 1)).getDate()}</div>
        <div>{new Date(weekStart.setDate(monthDay + 2)).getDate()}</div>
        <div>{new Date(weekStart.setDate(monthDay + 3)).getDate()}</div>
        <div>{new Date(weekStart.setDate(monthDay + 4)).getDate()}</div>
        <div>{new Date(weekStart.setDate(monthDay + 5)).getDate()}</div>
        <div>{new Date(weekStart.setDate(monthDay + 6)).getDate()}</div>
      </div>
    </>
  );
};

export default DisplayWeekDates;
