import { useDispatch, useSelector, shallowEqual } from "react-redux";
import DisplayWeekDates from "./DisplayWeekDates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { isMealLineFull } from "../utils/functions";
library.add(faCircleXmark);

const DisplayWeek = ({ lang }) => {
  const dispatch = useDispatch();
  const weekStructures = useSelector(
    (state) => state.weekStructureReducer.weekStructure
  );
  // const regimesConfig = useSelector(
  //   (state) => state.configurationReducer.configuration.regimes
  // );
  // const regimesReducer = useSelector((state) => state.regimesReducer);
  // const regime = regimesReducer.list.find(
  //   (regime) => regime.rowid === regimesReducer.selected
  // );

  return (
    <div className="tables">
      {/* {!loading ? ( */}
      {weekStructures.map((weekStructure, index) => {
        return (
          <div key={index} className="table">
            <DisplayWeekDates lang={lang} place={weekStructure} />
            {weekStructure.isUnfolded &&
              weekStructure.mealLines.map((mealLine, index) => {
                return (
                  <div key={index} className="line">
                    <div className="left-div">
                      <div key={"start"}></div>
                      {mealLine.map((mealBox, i) => {
                        return (
                          <div key={i}>
                            <input
                              type="checkbox"
                              disabled={mealBox.disabled}
                              checked={mealBox.booked}
                              style={{
                                accentColor: mealBox.regimeColor,
                              }}
                              onChange={() => {
                                // handleCheckBox(shift, id, firstDay);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    {isMealLineFull(mealLine) && (
                      <FontAwesomeIcon
                        icon="fa-regular fa-circle-xmark"
                        size="2xl"
                        style={{ color: "#ab0032" }}
                        onClick={() => {
                          // handleWeekButtons(id, month, week, place, 1);
                        }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

{
  /* {ids.map((id) => {
                const adjust = adujstLengthMax(
                  mm,
                  month,
                  week,
                  init_week,
                  lengthMax,
                  id,
                  hh,
                  config.deadline
                );
                const lengthMaxId = adjust.length;
                // const endDateCompensation = adjust.endDateCompensation;

                return (
                  <div key={id} className="line">
                    <div
                      className="left-div"
                      id={id === maxid ? "last" : "notlast"}
                    >
                      {order.lines && (
                        <Line
                          id={id}
                          date={date}
                          week={week}
                          init_week={init_week}
                          month={month}
                          place={place}
                          meals={meals}
                          disabledMeals={disabledMeals}
                          regimeId={regimeId}
                          lang={lang}
                        ></Line>
                      )}
                    </div>
                    {filterMeals(
                      meals,
                      id,
                      week,
                      init_week,
                      firstWeekDay,
                      place.rowid,
                      mm,
                      month
                    ).length === lengthMaxId ? (
                      <FontAwesomeIcon
                        icon="fa-regular fa-circle-xmark"
                        size="2xl"
                        style={{ color: "#ab0032" }}
                        onClick={() => {
                          handleWeekButtons(id, month, week, place, 1);
                        }}
                      />
                    ) : (
                      !(
                        month === mm &&
                        week === init_week &&
                        (day === 7 ||
                          // day === lastWeekDay ||
                          (day === 6 &&
                            ((id === 1 && hh >= deadline.breakfast) ||
                              (id === 2 && hh >= deadline.lunch) ||
                              (id === 3 && hh >= deadline.dinner))))
                      ) && (
                        <div id="chevron">
                          <FontAwesomeIcon
                            icon="fa-solid fa-chevron-left"
                            id="quickSelect"
                            onClick={() => {
                              handleWeekButtons(id, month, week, place, 0);
                            }}
                          />
                        </div>
                      )
                    )}
                  </div>
                );
              })} 
        </div>
      </div>
      {/* ) : (
          <div id="folded">
            <h2>{place.label}</h2>
            <FontAwesomeIcon
              id="chevron"
              onClick={() => {
                dispatch(updateIsUnFolded(isUnFolded, index));
              }}
              icon="fa-solid fa-chevron-right"
              size="xl"
            />
          </div>
        ); */
}

{
  /* // ) : (
      //   <div className="center">
      //     {config.language && config.language[lang].loading}
      //   </div>
      // )} */
}

export default DisplayWeek;
