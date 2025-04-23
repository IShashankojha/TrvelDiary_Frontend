import React from "react";
import moment from "moment";
import { MdUpdate, MdDeleteOutline, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="relative">
        {/* Close, Edit, and Delete Buttons */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md"
              onClick={onEditClick}
            >
              <MdUpdate className="text-lg" /> Update Story
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
              onClick={onDeleteClick}
            >
              <MdDeleteOutline className="text-lg" /> Delete
            </button>
            <button
              className="flex items-center justify-center text-xl text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              onClick={onClose}
            >
              <MdClose />
            </button>
          </div>
        </div>

        {/* Story Details */}
        <div className="flex flex-col gap-4">
          {/* Story Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {storyInfo?.title || "Untitled Story"}
          </h1>

          {/* Date and Location */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {storyInfo?.visitedDate
                ? moment(storyInfo.visitedDate).format("Do MMM YYYY")
                : "Date not available"}
            </span>
            {storyInfo?.visitedLocation?.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 bg-blue-100 dark:bg-blue-800/30 dark:text-blue-300 rounded-md">
                <GrMapLocation className="text-base" />
                {storyInfo.visitedLocation.join(", ")}
              </div>
            )}
          </div>

          {/* Image */}
          {storyInfo?.imageUrl && (
            <img
              src={storyInfo.imageUrl}
              alt="Story Visual"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          )}

          {/* Story Description */}
          <div className="mt-4">
            <p className="text-sm text-gray-800 dark:text-gray-300 leading-6 whitespace-pre-line">
              {storyInfo?.story || "No description available for this story."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTravelStory;
