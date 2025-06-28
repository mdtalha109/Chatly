import React from 'react';

const OnlineStatus = ({ isActive }) =>
  isActive ? (
    <div
      className="flex items-center text-xs text-emerald-500"
      data-testid="online-status"
    >
      <div className="w-[6px] h-[6px] bg-emerald-500 rounded-full mr-1"></div>
      Online
    </div>
  ) : null;

export default OnlineStatus;
