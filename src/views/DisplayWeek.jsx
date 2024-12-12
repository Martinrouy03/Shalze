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
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  isMealLineFull,
  setUnixDate,
  convertUnixToDate,
  convertDateToUnix,
  computeDateInfos,
} from "../utils/functions";
library.add(faCircleXmark, faChevronLeft);

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
    const selectedMeal = setUnixDate(selectedWeek.weekStart, weekDay);
    if (mealBox.booked) {
      // identifier l'orderLine en question
      order.lines.map((orderLine) => {
        let line = {
          ...orderLine,
          array_options: { ...orderLine.array_options },
        };
        const options = line.array_options;
        // jour correspondant à la mealBox considérée
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
                0,
                selectedWeek.month,
                token
              )
            );
          }
        }
      });
    } else {
      // meal not booked
      // On commence par identifier les lignes de commande qui correspondent au lieu, type de repas et régime sélectionné:
      const selectedLines = order.lines.filter(
        (orderLine) =>
          orderLine.array_options.options_lin_intakeplace ===
            weekStructure.rowId &&
          orderLine.fk_product ===
            String(config.dolibarrMealCode[mealLineId]) &&
          orderLine.array_options.options_lin_room === regimeSelected
      );
      selectedLines.map((orderLine) => {
        let line = {
          ...orderLine,
          array_options: { ...orderLine.array_options },
        };
        const options = line.array_options;
        // Si le jour précédent correspond à la fin d'une ligne de commande:
        if (setUnixDate(selectedMeal, -1) === options.options_lin_datefin) {
          // On distingue deux cas:
          // 1. s'il existe une ligne de commande dont la date début correspond au lendemain...
          let followingLine = selectedLines.filter(
            (selectedLine) =>
              selectedLine.array_options.options_lin_datedebut ===
              setUnixDate(selectedMeal, 1)
          );
          if (followingLine[0]) {
            // ... on fusionne les deux lignes de commande
            line.array_options.options_lin_datefin =
              followingLine[0].array_options.options_lin_datefin;

            line.qty = String(
              Number(line.qty) +
                (followingLine[0].array_options.options_lin_datefin -
                  selectedMeal) /
                  (24 * 3600) +
                1
            );
            // Extend the previous command line:
            dispatch(
              updateOrderLine(order.id, line, userId, selectedWeek.month, token)
            );
            // Delete the next command line:
            dispatch(
              removeOrderLine(
                order.id,
                followingLine[0].id,
                userId,
                selectedWeek.month,
                token
              )
            );
          } else {
            // 2. on rajoute un repas à la fin
            line.array_options.options_lin_datefin = setUnixDate(
              options.options_lin_datefin,
              1
            );
            line.qty = String(Number(line.qty) + 1);
            dispatch(
              updateOrderLine(order.id, line, userId, selectedWeek.month, token)
            );
          }
        } else if (
          setUnixDate(selectedMeal, 1) === options.options_lin_datedebut
        ) {
          // updateOrderLine : on rajoute un repas au début
          line.array_options.options_lin_datedebut = setUnixDate(
            options.options_lin_datedebut,
            -1
          );
          line.qty = String(Number(line.qty) + 1);
          dispatch(
            updateOrderLine(order.id, line, userId, selectedWeek.month, token)
          );
        }
      });
      if (selectedLines.length === 0) {
        // Sinon on créé une nouvelle ligne de commande
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
                options_lin_datefin: setUnixDate(
                  selectedWeek.weekStart,
                  weekDay
                ),
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
    }
  };
  const removeMeals = (placeId, mealLineId) => {
    console.log("remove Meals!");
    // Identifier l'orderLine en question
    const selectedLines = order.lines.filter(
      (line) =>
        line.array_options.options_lin_intakeplace === placeId &&
        line.fk_product === String(config.dolibarrMealCode[mealLineId]) &&
        line.array_options.options_lin_datedebut <= selectedWeek.weekEnd &&
        line.array_options.options_lin_datefin >= selectedWeek.weekStart
    );
    selectedLines.map((lineImmutable) => {
      const line = {
        ...lineImmutable,
        array_options: { ...lineImmutable.array_options },
      };
      // Si la ligne de commande se prolonge dans la semaine précédente ET dans la suivante: breakOrderLine
      if (
        line.array_options.options_lin_datedebut < selectedWeek.weekStart &&
        line.array_options.options_lin_datefin > selectedWeek.weekEnd
      ) {
        console.log("Test brigdeLine");
        dispatch(
          orderBreakLine(
            order,
            line,
            selectedWeek.weekStart,
            1,
            selectedWeek.month,
            token
          )
        );
      } else if (
        line.array_options.options_lin_datedebut < selectedWeek.weekStart
      ) {
        // Si la ligne de commande se prolonge dans la semaine précédente, on raccourcit la ligne de commande:
        line.array_options.options_lin_datefin = setUnixDate(
          selectedWeek.weekStart,
          -1
        );
        if (selectedWeek.nbWeeksBeforeMonthEnd === 0) {
          // si la ligne sélectionnée correspond à la dernière semaine du mois
          line.qty = String(
            Number(line.qty) -
              (convertUnixToDate(selectedWeek.monthEnd).getDay() || 7)
          );
        } else {
          line.qty = String(Number(line.qty) - 7);
        }
        dispatch(
          updateOrderLine(order.id, line, userId, selectedWeek.month, token)
        );
      } else if (
        line.array_options.options_lin_datefin > selectedWeek.weekEnd
      ) {
        // Si la ligne de commande se prolonge dans la semaine suivante uniquement: updateOrderLine
        line.array_options.options_lin_datedebut = setUnixDate(
          selectedWeek.weekEnd,
          1
        );
        if (selectedWeek.nbWeeksSinceMonthStart === 0) {
          // si la ligne sélectionnée correspond à la première semaine du mois
          if (selectedWeek.weekStart === selectedWeek.weekStartAbsolute) {
            //Si la semaine sélectionnée est la semaine en cours
            line.qty = String(
              Number(line.qty) - (7 - (new Date().getDay() || 7 - 1))
            ); // TODO: orderBreakLine
          } else {
            line.qty = String(
              Number(line.qty) -
                (7 -
                  (convertUnixToDate(selectedWeek.monthStart).getDay() ||
                    7 - 1))
            );
          }
        } else {
          line.qty = String(Number(line.qty) - 7);
        }
        dispatch(
          updateOrderLine(order.id, line, userId, selectedWeek.month, token)
        );
      } else {
        // Sinon: removeOrderLine
        dispatch(
          removeOrderLine(order.id, line.id, userId, selectedWeek.month, token)
        );
      }
    });
  };
  const addMeals = (weekStructure, mealLineId) => {
    // Identifier si des orderLines sont à supprimer
    const linesToRemove = order.lines.filter(
      (line) =>
        line.array_options.options_lin_intakeplace === weekStructure.rowId &&
        line.fk_product === String(config.dolibarrMealCode[mealLineId]) &&
        line.array_options.options_lin_datedebut >= selectedWeek.weekStart &&
        line.array_options.options_lin_datefin <= selectedWeek.weekEnd
    );
    // effacer chaque orderLine identifiée
    linesToRemove.map((selectedLine) => {
      dispatch(
        removeOrderLine(
          order.id,
          selectedLine.id,
          userId,
          selectedWeek.month,
          token
        )
      );
    });
    // Identifier les orderlines qui sont débordent sur la semaine précédente ou suivante:
    let crossingLines = order.lines.filter(
      (line) =>
        line.array_options.options_lin_intakeplace === weekStructure.rowId &&
        line.fk_product === String(config.dolibarrMealCode[mealLineId]) &&
        ((line.array_options.options_lin_datefin >=
          setUnixDate(selectedWeek.weekStart, -1) &&
          line.array_options.options_lin_datedebut < selectedWeek.weekStart) ||
          (line.array_options.options_lin_datedebut <=
            setUnixDate(selectedWeek.weekEnd, 1) &&
            line.array_options.options_lin_datefin > selectedWeek.weekEnd))
    );
    crossingLines = {
      ...crossingLines,
      array_options: { ...crossingLines.array_options },
    };
    // Si c'est la première semaine:
    // # To Test:
    if (selectedWeek.nbWeeksSinceMonthStart === 0) {
      let qty = 0;
      const output = computeDateInfos(weekStructure.mealLines[mealLineId]);
      if (selectedWeek.month === new Date().getMonth()) {
        // Si c'est la semaine en cours:
        crossingLines.array_options.options_lin_datedebut = output.date;
        qty = output.qty; // TODO: refaire le calcul de totalDaysUnavailable en tenant compte de la deadline horaire
        //  return qty;
      } else {
        // Sinon, si c'est la première semaine du mois
        crossingLines.array_options.options_lin_datedebut =
          selectedWeek.monthStart;
        qty =
          7 - ((convertUnixToDate(selectedWeek.monthStart).getDay() || 7) - 1);
        // return qty;
      }
      if (crossingLines.length) {
        const crossingLine = crossingLines[0];
        // Si crossingLineNext: updateOrderLine
        dispatch(
          updateOrderLine(
            order.id,
            crossingLine,
            userId,
            selectedWeek.month,
            token
          )
        );
      } else {
        // Sinon: addOrderLine:
        dispatch(
          addOrderLine(
            order,
            selectedWeek.month,
            {
              array_options: {
                options_lin_room: regimeSelected,
                options_lin_intakeplace: weekStructure.rowId,
                options_lin_datedebut: output.date,

                options_lin_datefin: selectedWeek.weekEnd,
              },
              fk_product: config.dolibarrMealCode[mealLineId],
              label: config.meal[mealLineId].label,
              qty: output.qty,
              subprice: config.meal[mealLineId].price,
              remise_percent: 0,
            },
            token
          )
        );
      }
    } else if (selectedWeek.nbWeeksBeforeMonthEnd === 0) {
      // # Reprendre
      // Si c'est la dernière semaine du mois:
      const totalDaysAvailable =
        convertUnixToDate(selectedWeek.monthEnd).getDay() || 7;
      // Si crossingLinePrevious: updateOrderLine:
      // Sinon: addOrderLine
      dispatch(
        addOrderLine(
          order,
          selectedWeek.month,
          {
            array_options: {
              options_lin_room: regimeSelected,
              options_lin_intakeplace: weekStructure.rowId,
              options_lin_datedebut: selectedWeek.weekStart,
              options_lin_datefin: setUnixDate(
                selectedWeek.weekStart,
                totalDaysAvailable - 1
              ),
            },
            fk_product: config.dolibarrMealCode[mealLineId],
            label: config.meal[mealLineId].label,
            qty: String(totalDaysAvailable),
            subprice: config.meal[mealLineId].price,
            remise_percent: 0,
          },
          token
        )
      );
    } else {
      // Si crossingLinesPrevious && Next: mergeLines
      // sinon si crossingLines Previous: updateOrderline
      // Sinon si crossingLines Next: updateOrderLine
      // Sinon: addOrderLine
      dispatch(
        addOrderLine(
          order,
          selectedWeek.month,
          {
            array_options: {
              options_lin_room: regimeSelected,
              options_lin_intakeplace: weekStructure.rowId,
              options_lin_datedebut: selectedWeek.weekStart,
              options_lin_datefin: selectedWeek.weekEnd,
            },
            fk_product: config.dolibarrMealCode[mealLineId],
            label: config.meal[mealLineId].label,
            qty: "7",
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
                    {isMealLineFull(mealLine) ? (
                      <FontAwesomeIcon
                        icon="fa-regular fa-circle-xmark"
                        size="2xl"
                        style={{ color: "#ab0032" }}
                        onClick={() => {
                          removeMeals(weekStructure.rowId, mealLineId);
                        }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        id="chevron"
                        onClick={() => {
                          addMeals(weekStructure, mealLineId);
                        }}
                        icon="fa-solid fa-chevron-left"
                        size="sm"
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
