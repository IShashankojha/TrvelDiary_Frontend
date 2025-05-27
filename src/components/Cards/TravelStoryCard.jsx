import React from 'react';
import { FaHeart } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment';

const TravelStoryCard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div
      className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white dark:bg-slate-900 border dark:border-slate-700 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform group-hover:scale-105 duration-300"
        />

        {/* Favourite Button */}
        <button
          className="absolute top-3 right-3 w-10 h-10 sm:w-11 sm:h-11 bg-white/40 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/30 dark:border-slate-600 flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteClick();
          }}
        >
          <FaHeart
            className={`text-lg transition-colors ${
              isFavourite ? 'text-red-500' : 'text-white dark:text-slate-300'
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Title and Date */}
        <div className="flex items-start justify-between">
          <div>
            <h6 className="text-base font-semibold text-slate-800 dark:text-white line-clamp-1">{title}</h6>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {date ? moment(date).format('Do MMM YYYY') : '_'}
            </span>
          </div>
        </div>

        {/* Story Preview */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {story}
        </p>

        {/* Visited Location */}
        <div className="flex flex-wrap gap-2 mt-2">
          {visitedLocation.map((loc, index) => (
            <span
              key={index}
              className="flex items-center gap-1 text-xs bg-cyan-100 dark:bg-cyan-800/40 text-cyan-700 dark:text-cyan-300 px-2 py-1 rounded-full"
            >
              <GrMapLocation className="text-sm" />
              {loc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
