import { useDispatch, useSelector, shallowEqual } from "react-redux";
import DisplayWeekDates from "./DisplayWeekDates";
import {
  addOrderLine,
  removeOrderLine,
  updateOrderLine,
  orderBreakLine,
} from "../services/OrderActions";
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
  const order = useSelector((state) => state.orderReducer.order);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const handleCheckBox = (mealBox, weekStructure, mealLineId, weekDay) => {
    if (mealBox.booked) {
      // identifier l'orderLine en question
      order.lines.map((orderLine) => {
        let line = {
          ...orderLine,
          array_options: { ...orderLine.array_options },
        };
        const options = line.array_options;
        const selectedMeal = setUnixDate(selectedWeek.weekStart, weekDay); // jour correspondant à la mealBox considérée
        if (
          options.options_lin_intakeplace === String(weekStructure.rowId) &&
          orderLine.fk_product ===
            String(config.dolibarrMealCode[mealLineId]) &&
          selectedMeal >= options.options_lin_datedebut &&
          selectedMeal <= options.options_lin_datefin // si la weekStructure correspond au lieu indiqué dans orderLines
        ) {
          // Si datedebut === datefin: deleteOrderline
          if (options.options_lin_datedebut === options.options_lin_datefin) {
            dispatch(
              removeOrderLine(
                order.id,
                orderLine.id,
                userId,
                selectedWeek.month,
                token
              )
            );
          } else if (selectedMeal === options.options_lin_datedebut) {
            // updateOrderLine : on raccourcit d'un repas au début
            line.array_options.options_lin_datedebut = setUnixDate(
              options.options_lin_datedebut,
              1
            );
            line.qty = String(Number(line.qty) - 1);
            dispatch(
              updateOrderLine(order.id, line, userId, selectedWeek.month, token)
            );
          } else if (selectedMeal === options.options_lin_datefin) {
            // updateOrderLine : on raccourcit d'un repas à la fin
            line.array_options.options_lin_datefin = setUnixDate(
              options.options_lin_datefin,
              -1
            );
            line.qty = String(Number(line.qty) - 1);
            dispatch(
              updateOrderLine(order.id, line, userId, selectedWeek.month, token)
            );
          } else {
            // Split line into two
            dispatch(
              // TODO: test if working
              orderBreakLine(
                order,
                line,
                selectedMeal,
                selectedWeek.month,
                token
              )
            );
          }
        }
      });
    } else {
      // meal not booked
      // Si yesterday === datefin && previousMeal.regime === regimeSelected: updateOrderLine
      // Si tomorrow === datedebut && followingMeal.regime === regimeSelected: updateOrderLine
      // Sinon:
      dispatch(
        addOrderLine(
          order,
          selectedWeek.month,
          {
            array_options: {
              options_lin_room: regimeSelected,
              options_lin_intakeplace: weekStructure.rowId,
              options_lin_datedebut: setUnixDate(
                selectedWeek.weekStart,
                weekDay
              ),
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
    }
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
                                  mealBox,
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
