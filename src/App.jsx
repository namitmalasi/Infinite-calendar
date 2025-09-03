import React, { useState, useEffect, useRef, useCallback } from "react";
import { CalendarMonth } from "./components/CalendarMonth";
import { JournalCard } from "./components/JournalCard";
import { journalData } from "./data/journalData";
import {
  getMonthsInRange,
  parseJournalDate,
  getMonthName,
} from "./utils/dateUtils";

function App() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Generate months range (12 months in past/future initially)
  const [monthsRange, setMonthsRange] = useState(() => {
    const now = new Date();
    return getMonthsInRange(now.getFullYear(), now.getMonth(), 12, 12);
  });

  // Group journal entries by date
  const entriesByDate = React.useMemo(() => {
    const grouped = {};
    journalData.forEach((entry) => {
      const date = parseJournalDate(entry.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(entry);
    });
    return grouped;
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { scrollTop, clientHeight } = container;

    // Find which month is most visible
    const monthElements = container.querySelectorAll("[data-month]");
    let mostVisibleMonth = currentMonth;
    let maxVisibleArea = 0;

    monthElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight > maxVisibleArea) {
        maxVisibleArea = visibleHeight;
        const monthData = element.getAttribute("data-month");
        if (monthData) {
          const [year, month] = monthData.split("-").map(Number);
          mostVisibleMonth = { month, year };
        }
      }
    });

    setCurrentMonth(mostVisibleMonth);

    // Extend range if nearing edges
    const threshold = clientHeight * 2;
    if (scrollTop < threshold) {
      setMonthsRange((prev) => {
        const first = prev[0];
        const newMonths = getMonthsInRange(first.year, first.month, 6, 0);
        return [...newMonths.slice(0, -1), ...prev];
      });
    }

    if (scrollTop > container.scrollHeight - clientHeight - threshold) {
      setMonthsRange((prev) => {
        const last = prev[prev.length - 1];
        const newMonths = getMonthsInRange(last.year, last.month, 0, 6);
        return [...prev, ...newMonths.slice(1)];
      });
    }
  }, [currentMonth]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleJournalClick = (entry) => {
    const entryIndex = journalData.findIndex((e) => e === entry);
    setSelectedEntry(entry);
    setSelectedEntryIndex(entryIndex);
  };

  const handleSwipeNext = () => {
    if (selectedEntryIndex < journalData.length - 1) {
      const nextIndex = selectedEntryIndex + 1;
      setSelectedEntryIndex(nextIndex);
      setSelectedEntry(journalData[nextIndex]);
    }
  };

  const handleSwipePrev = () => {
    if (selectedEntryIndex > 0) {
      const prevIndex = selectedEntryIndex - 1;
      setSelectedEntryIndex(prevIndex);
      setSelectedEntry(journalData[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {getMonthName(currentMonth.month)} {currentMonth.year}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Hair Journey Calendar</p>
        </div>
      </div>

      {/* Calendar Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
          {monthsRange.map((monthData) => (
            <CalendarMonth
              key={`${monthData.year}-${monthData.month}`}
              month={monthData.month}
              year={monthData.year}
              entries={entriesByDate}
              onJournalClick={handleJournalClick}
            />
          ))}
        </div>
      </div>

      {/* Journal Card Modal */}
      {selectedEntry && (
        <JournalCard
          entry={selectedEntry}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onSwipeNext={handleSwipeNext}
          onSwipePrev={handleSwipePrev}
          canSwipeNext={selectedEntryIndex < journalData.length - 1}
          canSwipePrev={selectedEntryIndex > 0}
        />
      )}
    </div>
  );
}

export default App;
