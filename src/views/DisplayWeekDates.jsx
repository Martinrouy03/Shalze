import { useSelector, useDispatch } from "react-redux";
import { convertUnixToDate } from "../utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateFolding } from "../services/WeekStructureActions";
const DisplayWeekDates = ({ lang, place }) => {
  const dispatch = useDispatch();
  // console.log(place.mealLines[0]);
  const dinner = place.mealLines.find(
    (mealLine) => mealLine[0].meal === "dinner"
  );
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  const weekStart = convertUnixToDate(
    useSelector((state) => state.weekStructureReducer.selectedWeek.weekStart)
  );
  let weekNames = [<div key={"start"}></div>];
  let weekDates = [
    <div id="placeLabel" key={"start"}>
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {place.label}
      </h2>
      {place.isUnfolded ? (
        <FontAwesomeIcon
          id="chevron"
          onClick={() => {
            dispatch(updateFolding(place.rowId));
          }}
          icon="fa-solid fa-chevron-down"
          size="lg"
        />
      ) : (
        <FontAwesomeIcon
          id="chevron"
          onClick={() => {
            dispatch(updateFolding(place.rowId));
          }}
          icon="fa-solid fa-chevron-right"
          size="lg"
        />
      )}
    </div>,
  ];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(weekStart);
    weekNames.push(
      <div
        key={i}
        style={{
          color: dinner[i].disabled ? "grey" : "black",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
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
      <div className="line">
        <div
          className="left-div"
          style={{
            borderRadius: "10px 10px 0 0",
            height: "30px",
            padding: "0px",
          }}
        >
          {weekNames}
        </div>
      </div>
      <div className="line">
        <div
          className="left-div"
          style={{
            padding: "0px",
            height: "30px",
          }}
        >
          {weekDates}
        </div>
      </div>
    </>
  );
};

export default DisplayWeekDates;
