import React, { useState } from 'react';
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import moment from 'moment';
import "react-day-picker/dist/style.css";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div className="relative">
      {/* Date Button */}
      <button
        className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 
                   dark:text-sky-400 dark:bg-sky-700/40 dark:hover:bg-sky-700/70 rounded px-2 py-1 cursor-pointer transition-colors"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-base sm:text-lg" />
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {/* Date Picker Modal */}
      {openDatePicker && (
        <div className="fixed inset-0 backdrop-blur-sm bg-sky-50/80 dark:bg-slate-900/80 flex items-center justify-center z-50 p-5">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md p-4 relative">
            {/* Close Button */}
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-200 
                         dark:bg-sky-700 dark:hover:bg-sky-600 absolute top-2 right-2"
              onClick={() => setOpenDatePicker(false)}
            >
              <MdClose className="text-sky-600 dark:text-sky-300 text-base sm:text-lg" />
            </button>

            {/* Custom Styled DayPicker */}
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown-buttons"
              pagedNavigation
              className="bg-white dark:bg-gray-800 rounded"
              classNames={{
                caption: "text-black dark:text-white",
                head: "text-slate-600 dark:text-slate-300",
                head_cell: "text-xs font-semibold px-2 py-1 dark:text-gray-300",
                day: "w-9 h-9 text-sm rounded-full hover:bg-sky-100 dark:hover:bg-sky-700 dark:text-white",
                day_selected: "bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white",
                day_today: "border border-sky-500 dark:border-sky-400",
                nav_button: "text-sky-600 hover:bg-sky-100 dark:text-sky-300 dark:hover:bg-sky-700",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
