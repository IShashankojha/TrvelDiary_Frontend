import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 sm:mt-20 px-4">
      <img 
        src={imgSrc} 
        alt="No content" 
        className="w-16 sm:w-24 md:w-32 lg:w-40" 
      />
      <p 
        className="w-full sm:w-3/4 md:w-1/2 text-sm md:text-base lg:text-lg font-medium text-center mt-4 sm:mt-5 text-slate-700 dark:text-slate-300"
      >
        {message}
      </p>      
    </div>
  );
};

export default EmptyCard;