import React from 'react';

const ErrorLoadingChats = ({ onRetry, message = "Failed to load chats" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg
        className="w-16 h-16 text-red-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorLoadingChats;
