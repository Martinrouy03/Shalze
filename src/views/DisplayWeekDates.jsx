import { store } from "../app/App";
import { useSelector } from "react-redux";
import { convertUnixToDate } from "../utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DisplayWeekDates = ({ lang, place }) => {
  const dinner = useSelector(
    (state) => state.weekStructureReducer.weekStructure.dinner
  );
  const config = store.getState().configurationReducer.configuration;
  const weekStart = convertUnixToDate(
    store.getState().weekStructureReducer.selectedWeek.weekStart
  );
  let weekNames = [<div key={"start"}></div>];
  let weekDates = [
    <div id="placeLabel" key={"start"}>
      <h2>{place.label}</h2>
      <FontAwesomeIcon
        id="chevron"
        onClick={() => {
          //   handleFolding(indexPlace, isUnFolded);
        }}
        icon="fa-solid fa-chevron-down"
        size="xl"
      />
    </div>,
  ];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(weekStart);
    weekNames.push(
      <div key={i} style={{ color: dinner[i].disabled ? "grey" : "black" }}>
        {config.language[lang].weekDay[i]}
      </div>
    );
    weekDates.push(
      <div key={i} style={{ color: dinner[i].disabled ? "grey" : "black" }}>
        {new Date(newDate.setDate(weekStart.getDate() + i)).getDate()}
      </div>
    );
  }
  return (
    <>
      <div>{weekNames}</div>
      <div>{weekDates}</div>
    </>
  );
};

export default DisplayWeekDates;
