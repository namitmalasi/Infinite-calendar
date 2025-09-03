import React, { useRef, useEffect } from "react";
import { X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { parseJournalDate, formatDateLong } from "../utils/dateUtils";

export const JournalCard = ({
  entry,
  isOpen,
  onClose,
  onSwipeNext,
  onSwipePrev,
  canSwipeNext,
  canSwipePrev,
}) => {
  const cardRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px)`;
      cardRef.current.style.opacity = `${1 - Math.abs(diff) / 300}`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const diff = currentX.current - startX.current;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && canSwipePrev) {
        onSwipePrev();
      } else if (diff < 0 && canSwipeNext) {
        onSwipeNext();
      }
    }

    if (cardRef.current) {
      cardRef.current.style.transform = "";
      cardRef.current.style.opacity = "";
    }

    isDragging.current = false;
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
    isDragging.current = true;

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      currentX.current = e.clientX;
      const diff = currentX.current - startX.current;

      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${diff}px)`;
        cardRef.current.style.opacity = `${1 - Math.abs(diff) / 300}`;
      }
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;

      const diff = currentX.current - startX.current;
      const threshold = 100;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && canSwipePrev) {
          onSwipePrev();
        } else if (diff < 0 && canSwipeNext) {
          onSwipeNext();
        }
      }

      if (cardRef.current) {
        cardRef.current.style.transform = "";
        cardRef.current.style.opacity = "";
      }

      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-500";
    return "text-red-500";
  };

  const formatEntryDate = (dateString) => {
    const date = parseJournalDate(dateString);
    return formatDateLong(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] 
                   overflow-y-auto transform transition-all duration-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Hair Journey Entry
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={entry.imgUrl}
              alt="Hair journey entry"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Date and Rating */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              {formatEntryDate(entry.date)}
            </span>
            <div className="flex items-center space-x-1">
              <Star
                className={`w-4 h-4 fill-current ${getRatingColor(
                  entry.rating
                )}`}
              />
              <span className="font-medium text-gray-900">{entry.rating}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.categories.map((category, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 
                           px-3 py-1 rounded-full text-sm font-medium border border-purple-200"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-base">
            {entry.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onSwipePrev}
              disabled={!canSwipePrev}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 
                         bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-gray-500">Swipe to navigate</div>

            <button
              onClick={onSwipeNext}
              disabled={!canSwipeNext}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 
                         bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
