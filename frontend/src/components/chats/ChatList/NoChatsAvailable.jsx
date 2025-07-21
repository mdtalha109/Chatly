import React from 'react';

const NoChatsAvailable = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-[100%]">
      <h1 className="text-gray-600 text-lg font-semibold">{message}</h1>
    </div>
  );
};

export default NoChatsAvailable;
