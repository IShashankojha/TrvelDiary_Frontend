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
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      {/* Image Section */}
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-40 sm:h-46 md:h-52 lg:h-60 object-cover rounded-t-lg"
        onClick={onClick}
      />

      {/* Favourite Button */}
      <button
        className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-3 sm:top-4 right-3 sm:right-4"
        onClick={(e) => {
          e.stopPropagation();
          onFavouriteClick();
        }}
      >
        <FaHeart
          className={`icon-btn ${
            isFavourite ? 'text-red-500' : 'text-white'
          }`}
        />
      </button>

      {/* Content Section */}
      <div className="p-4" onClick={onClick}>
        {/* Title and Date */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-sm sm:text-base font-medium">{title}</h6>
            <span className="text-xs sm:text-sm text-slate-500">
              {date ? moment(date).format('Do MMM YYYY') : '_'}
            </span>
          </div>
        </div>

        {/* Story Preview */}
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {story?.slice(0, 60)}
          {story?.length > 60 && '...'}
        </p>

        {/* Visited Location */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className="text-sm sm:text-base" />
          {visitedLocation.map((item, index) =>
            visitedLocation.length === index + 1 ? `${item}` : `${item}, `
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
