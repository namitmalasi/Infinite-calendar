import React from "react";
import { Star } from "lucide-react";

export const JournalDayEntry = ({ entry, onClick }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-sm p-1.5 cursor-pointer 
                 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 
                 hover:shadow-sm border border-purple-100 text-xs overflow-hidden"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center space-x-1">
          <Star
            className={`w-2.5 h-2.5 fill-current ${getRatingColor(
              entry.rating
            )}`}
          />
          <span className="text-xs font-medium text-gray-700">
            {entry.rating}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-600 leading-tight mb-0.5 overflow-hidden">
        <div className="line-clamp-1">
          {entry.description.substring(0, 40)}...
        </div>
      </div>

      <div className="flex flex-wrap gap-0.5">
        {entry.categories.slice(0, 1).map((category, index) => (
          <span
            key={index}
            className="inline-block bg-purple-200 text-purple-800 text-xs px-1 py-0.5 
                       rounded-full font-medium truncate max-w-full"
          >
            {category}
          </span>
        ))}
        {entry.categories.length > 1 && (
          <span className="text-xs text-gray-500">
            +{entry.categories.length - 1}
          </span>
        )}
      </div>
    </div>
  );
};
