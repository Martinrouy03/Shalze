import { useDispatch, useSelector, shallowEqual } from "react-redux";
import DisplayWeekDates from "./DisplayWeekDates";
import { addOrderLine } from "../services/OrderActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { isMealLineFull, setUnixDate } from "../utils/functions";
library.add(faCircleXmark);

const DisplayWeek = ({ lang }) => {
  const dispatch = useDispatch();
  const config = useSelector(
    (state) => state.configurationReducer.configuration
  );
  const weekStructures = useSelector(
    (state) => state.weekStructureReducer.weekStructure
  );
  const regimeSelected = useSelector(
    (state) => state.weekStructureReducer.regimeSelected
  );
  const selectedWeek = useSelector(
    (state) => state.weekStructureReducer.selectedWeek
  );
  const token = localStorage.getItem("token");
  const order = useSelector((state) => state.orderReducer.order);
  const handleCheckBox = (weekStructure, mealLineId, weekDay) => {
    dispatch(
      addOrderLine(
        order,
        selectedWeek.month,
        {
          array_options: {
            options_lin_room: regimeSelected,
            options_lin_intakeplace: weekStructure.rowId,
            options_lin_datedebut: setUnixDate(selectedWeek.weekStart, weekDay),
            options_lin_datefin: setUnixDate(selectedWeek.weekStart, weekDay),
          },
          fk_product: config.dolibarrMealCode[mealLineId],
          label: config.meal[mealLineId].label,
          qty: "1",
          subprice: config.meal[mealLineId].price,
          remise_percent: 0,
        },
        token
      )
    );
  };
  return (
    <div className="tables">
      {/* {!loading ? ( */}
      {weekStructures.map((weekStructure, placeId) => {
        return (
          <div key={placeId} className="table">
            <DisplayWeekDates lang={lang} place={weekStructure} />
            {weekStructure.isUnfolded &&
              weekStructure.mealLines.map((mealLine, mealLineId) => {
                return (
                  <div key={mealLineId} className="line">
                    <div className="left-div">
                      <div key={"start"}></div>
                      {mealLine.map((mealBox, weekDay) => {
                        return (
                          <div key={weekDay}>
                            <input
                              type="checkbox"
                              disabled={mealBox.disabled}
                              checked={mealBox.booked}
                              style={{
                                accentColor: mealBox.regimeColor,
                              }}
                              onChange={() => {
                                handleCheckBox(
                                  weekStructure,
                                  mealLineId,
                                  weekDay
                                );
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

export default DisplayWeek;
