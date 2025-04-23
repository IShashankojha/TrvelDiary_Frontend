import React, { useState } from 'react';
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import moment from 'moment';

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div className="relative">
      {/* Date Button */}
      <button
        className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer 
                   dark:text-sky-400 dark:bg-sky-700/40 dark:hover:bg-sky-700/70 transition-colors"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-base sm:text-lg" />
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {/* Date Picker */}
      {openDatePicker && (
        <div className="fixed inset-0 bg-sky-50/80 dark:bg-slate-900/80 flex items-center justify-center z-10 p-5">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 relative dark:bg-gray-800 dark:text-white">
            {/* Close Button */}
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-200 absolute top-2 right-2 
                         dark:bg-sky-700 dark:hover:bg-sky-600"
              onClick={() => setOpenDatePicker(false)}
            >
              <MdClose className="text-sky-600 text-base sm:text-lg dark:text-sky-300" />
            </button>

            {/* Day Picker */}
            <DayPicker
              captionLayout="dropdown-buttons"
              mode="single"
              selected={date}
              onSelect={setDate}
              pagedNavigation
              classNames={{
                caption: "text-black dark:text-white",
                head_cell: "text-slate-600 dark:text-slate-300",
                day: "hover:bg-sky-100 dark:hover:bg-sky-700 rounded",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
``
