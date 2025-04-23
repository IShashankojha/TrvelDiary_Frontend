import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { GrMapLocation } from 'react-icons/gr';

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle keydown events
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-xs sm:text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded dark:text-cyan-300 dark:bg-cyan-700"
            >
              <GrMapLocation className="text-sm" /> {tag}
              <button
                className="text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200"
                onClick={() => handleRemoveTag(tag)}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 sm:gap-4">
        <input
          type="text"
          value={inputValue}
          className="w-full sm:w-80 text-sm bg-transparent border px-3 py-2 rounded outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          placeholder="Add Locations"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded bg-cyan-500 text-white hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          onClick={addNewTag}
        >
          <MdAdd className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
