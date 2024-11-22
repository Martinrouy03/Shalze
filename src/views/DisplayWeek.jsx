import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { store } from "../app/App";
import DisplayWeekDates from "./DisplayWeekDates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateIsUnFolded } from "../services/PlacesActions";
const DisplayWeek = ({ lang }) => {
  const dispatch = useDispatch();
  const placesList = store.getState().placesReducer.places;
  const isUnFolded = store.getState().placesReducer.isUnFolded;
  return (
    <div className="tables">
      {/* {!loading ? ( */}
      {placesList.map((place, index) => {
        return isUnFolded[index] ? (
          <div index={index} className="table">
            <div className="table">
              <div className="line">
                <div
                  className="left-div"
                  style={{ borderRadius: "10px 10px 0 0" }}
                >
                  <DisplayWeekDates lang={lang} place={place} />
                </div>
              </div>
              {/* {ids.map((id) => {
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
              })} */}
            </div>
          </div>
        ) : (
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
        );
      })}
      {/* // ) : (
      //   <div className="center">
      //     {config.language && config.language[lang].loading}
      //   </div>
      // )} */}
    </div>
  );
};

export default DisplayWeek;
