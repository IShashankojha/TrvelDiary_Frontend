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
        className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={() => setOpenDatePicker(true)}
      >
        <MdOutlineDateRange className="text-base sm:text-lg" />
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {/* Date Picker */}
      {openDatePicker && (
        <div className="fixed inset-0 bg-sky-50/80 flex items-center justify-center z-10 p-5">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 relative">
            {/* Close Button */}
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-200 absolute top-2 right-2"
              onClick={() => setOpenDatePicker(false)}
            >
              <MdClose className="text-sky-600 text-base sm:text-lg" />
            </button>

            {/* Day Picker */}
            <DayPicker
              captionLayout="dropdown-buttons"
              mode="single"
              selected={date}
              onSelect={setDate}
              pagedNavigation
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
