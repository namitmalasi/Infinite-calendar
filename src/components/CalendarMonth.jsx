import React from "react";
import { JournalDayEntry } from "./JournalDayEntry";
import {
  getDaysInMonthCount,
  getFirstDayOfMonth,
  getMonthName,
  getDayName,
} from "../utils/dateUtils";

export const CalendarMonth = ({ month, year, entries, onJournalClick }) => {
  const daysInMonth = getDaysInMonthCount(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);

  const dayNames = Array.from({ length: 7 }, (_, i) => getDayName(i));

  // Create array for calendar grid
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month}-${day}`;
    const dayEntries = entries[dateKey] || [];
    calendarDays.push({ day, entries: dayEntries });
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm border overflow-hidden"
      data-month={`${year}-${month}`}
    >
      {/* Month Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
        <h2 className="text-xl font-semibold">
          {getMonthName(month)} {year}
        </h2>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b bg-gray-50">
        {dayNames.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className="border-r border-b last:border-r-0 h-24 sm:h-32 flex flex-col overflow-hidden"
          >
            {dayData ? (
              <>
                <div className="px-2 py-1 text-sm font-medium text-gray-900 flex-shrink-0">
                  {dayData.day}
                </div>
                <div className="flex-1 px-1 pb-1 space-y-1 overflow-hidden">
                  {dayData.entries.map((entry, entryIndex) => (
                    <JournalDayEntry
                      key={entryIndex}
                      entry={entry}
                      onClick={() => onJournalClick(entry)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-50"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
