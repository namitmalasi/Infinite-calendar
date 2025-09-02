import {
  parse,
  format,
  getDaysInMonth,
  getDay,
  startOfMonth,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";

export const parseJournalDate = (dateString) => {
  // Parse DD/MM/YYYY format
  return parse(dateString, "dd/MM/yyyy", new Date());
};

export const getMonthsInRange = (
  startYear,
  startMonth,
  monthsBefore,
  monthsAfter
) => {
  const months = [];
  const startDate = new Date(startYear, startMonth, 1);

  // Add months before
  for (let i = monthsBefore; i > 0; i--) {
    const monthDate = subMonths(startDate, i);
    months.push({
      month: monthDate.getMonth(),
      year: monthDate.getFullYear(),
    });
  }

  // Add current month
  months.push({ month: startMonth, year: startYear });

  // Add months after
  for (let i = 1; i <= monthsAfter; i++) {
    const monthDate = addMonths(startDate, i);
    months.push({
      month: monthDate.getMonth(),
      year: monthDate.getFullYear(),
    });
  }

  return months;
};

export const getDaysInMonthCount = (month, year) => {
  return getDaysInMonth(new Date(year, month, 1));
};

export const getFirstDayOfMonth = (month, year) => {
  return getDay(startOfMonth(new Date(year, month, 1)));
};

export const formatDate = (date) => {
  return format(date, "PPPP"); // Full date format like "Monday, January 1st, 2024"
};

export const formatDateShort = (date) => {
  return format(date, "MMM d, yyyy"); // Short format like "Jan 1, 2024"
};

export const isSameDayUtil = (date1, date2) => {
  return isSameDay(date1, date2);
};

export const createDateKey = (year, month, day) => {
  return `${year}-${month}-${day}`;
};

export const getDateFromKey = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month, day);
};

export const isDateInMonth = (date, month, year) => {
  return date.getMonth() === month && date.getFullYear() === year;
};

export const getMonthName = (month) => {
  return format(new Date(2000, month, 1), "MMMM");
};

export const getMonthNameShort = (month) => {
  return format(new Date(2000, month, 1), "MMM");
};

export const getDayName = (dayIndex) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
};
