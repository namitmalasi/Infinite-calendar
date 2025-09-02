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
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-md p-2 cursor-pointer 
                 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 
                 hover:shadow-md transform hover:-translate-y-0.5 border border-purple-100"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1">
          <Star
            className={`w-3 h-3 fill-current ${getRatingColor(entry.rating)}`}
          />
          <span className="text-xs font-medium text-gray-700">
            {entry.rating}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-600 line-clamp-2 leading-tight">
        {entry.description.substring(0, 60)}...
      </div>

      <div className="mt-1 flex flex-wrap gap-1">
        {entry.categories.slice(0, 2).map((category, index) => (
          <span
            key={index}
            className="inline-block bg-purple-200 text-purple-800 text-xs px-1.5 py-0.5 
                       rounded-full font-medium"
          >
            {category}
          </span>
        ))}
        {entry.categories.length > 2 && (
          <span className="text-xs text-gray-500">
            +{entry.categories.length - 2}
          </span>
        )}
      </div>
    </div>
  );
};
