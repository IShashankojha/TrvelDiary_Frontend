import moment from 'moment';
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {
  const DateRangeChip = ({ date }) => {
    const startDate = date?.from
      ? moment(date?.from).format('Do MMM YYYY')
      : 'N/A';
    const endDate = date?.to
      ? moment(date?.to).format('Do MMM YYYY')
      : 'N/A';

    return (
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded shadow-sm max-w-full dark:bg-slate-800">
        <p className="text-xs sm:text-sm md:text-base font-medium truncate dark:text-white">
          {startDate} - {endDate}
        </p>
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-300 dark:hover:text-white"
        >
          <MdOutlineClose className="text-sm sm:text-base md:text-lg" />
        </button>
      </div>
    );
  };

  return (
    <div className="mb-5 px-4 sm:px-6">
      {filterType === 'search' ? (
        <h3 className="text-base sm:text-lg font-medium text-center sm:text-left dark:text-white">
          Search Results
        </h3>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <h3 className="text-base sm:text-lg font-medium text-center sm:text-left dark:text-white">
            Travel stories from
          </h3>
          <DateRangeChip date={filterDates} />
        </div>
      )}
    </div>
  );
};

export default FilterInfoTitle;
