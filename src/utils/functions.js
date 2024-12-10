import moment from "moment";
import { store } from "../app/App";
export const convertTimeToUnix = (date) => {
  return Math.floor(date / 1000);
};
export const convertDateToUnix = (date) => {
  return Math.floor(date.getTime() / 1000);
};

export const convertUnixToDate = (unixDate) => {
  return new Date(moment.unix(unixDate));
};

export const convertUnixToWeekDay = (unixDate) => {
  const date = new Date(moment.unix(unixDate));
  return date.getDay();
};
export const convertUnixToDay = (unixDate) => {
  const date = new Date(moment.unix(unixDate));
  return date.getDate();
};
export const convertUnixToMonth = (unixDate) => {
  const date = new Date(moment.unix(unixDate));
  console.log(date);
  return date.getMonth();
};

export const setUnixDate = (unixDate, shift) => {
  const date = convertUnixToDate(unixDate);

  const monthDay = date.getDate();

  date.setDate(monthDay + shift);

  return convertDateToUnix(date);
};

export function computeMaxWeeks(monthStart, monthEnd) {
  const start = convertUnixToWeekDay(monthStart) || 7;
  const end = convertUnixToDay(monthEnd);
  const maxWeeks = Math.floor((end + start) / 7);
  // console.log(start, end, maxWeeks);
  return maxWeeks;
}
export function computeNbWeeksBeforeMonthEnd(weekStart, monthEnd) {
  const start = convertUnixToDay(weekStart);
  const end = convertUnixToDay(monthEnd);
  const nbWeeksBeforeMonthEnd = Math.floor((end - start) / 7);
  return nbWeeksBeforeMonthEnd;
}
export function computeNbWeeksSinceMonthStart(weekEnd, monthStart) {
  const end = convertUnixToDay(weekEnd);
  const start = convertUnixToDay(monthStart);
  const nbWeeksBeforeMonthEnd = Math.floor((end - start) / 7);
  return nbWeeksBeforeMonthEnd;
}

export function disabledMeal(
  weekStructures,
  placeId,
  mealId,
  weekDay,
  weekStart,
  monthStart,
  monthEnd,
  deadline
) {
  const config = store.getState().configurationReducer.configuration;
  let output = null;
  const newDate = new Date(weekStart);
  const day_i = new Date(
    new Date(newDate.setDate(weekStart.getDate() + weekDay)).setHours(
      0,
      0,
      0,
      0
    )
  );
  let alreadyBookedElsewhere = 0; // Check if the meal is already booked in another place
  weekStructures.map((weekStructure, placeBis) => {
    if (
      placeBis !== placeId &&
      weekStructure.mealLines[mealId][weekDay].booked
    ) {
      alreadyBookedElsewhere = 1;
    }
  });

  if (monthStart.getMonth() === new Date().getMonth()) {
    if (
      // Si le jour considéré est compris entre aujourd'hui et la fin du mois
      day_i >= new Date(new Date().setHours(0, 0, 0, 0)) &&
      day_i <= monthEnd
    ) {
      if (
        // si le jour considéré est la date d'aujourdhui et la deadline est passée
        day_i.toDateString() ===
          new Date(new Date().setHours(0, 0, 0, 0)).toDateString() &&
        new Date().getHours() >= deadline
      ) {
        output = 1; // alors le repas est indisponible à la réservation
      } else if (alreadyBookedElsewhere) {
        output = 1;
      } else {
        // Si le repas n'est pas déjà réservé sur un autre lieu
        output = 0; // Autrement le repas est disponible
      }
    } else {
      // sinon, les repas sont indisponibles à la réservation
      output = 1;
    }
  } else {
    if (
      // Si le jour considéré est compris entre aujourd'hui et la fin du mois
      day_i >= monthStart &&
      day_i <= monthEnd
    ) {
      output = 0; //repas est disponible
    } else output = 1; // repas indisponible à la réservation
  }
  return output;
}

export const isMealLineFull = (mealLine) => {
  let bookedCount = 0;
  let enabledCount = 0;
  mealLine.map((meal) => {
    if (!meal.disabled) {
      enabledCount += 1;
      if (meal.booked) {
        bookedCount += 1;
      }
    }
  });
  return bookedCount === enabledCount && enabledCount > 0;
};
