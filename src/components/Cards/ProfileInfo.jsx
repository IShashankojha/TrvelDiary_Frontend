import React from 'react';
import { getinitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) {
    return null; // Render nothing if userInfo is null
  }

  return (
    userInfo && (
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 px-4 sm:px-0">
        {/* User Avatar */}
        <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full text-slate-950 dark:text-white font-medium bg-slate-100 dark:bg-gray-800">
          {getinitials(userInfo.fullName || '')}
        </div>

        {/* User Information */}
        <div className="text-center sm:text-left">
          <p className="text-sm sm:text-base font-medium text-slate-950 dark:text-white">
            {userInfo.fullName || ''}
          </p>
          <button
            className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 underline hover:text-slate-900 dark:hover:text-white transition-colors"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;
