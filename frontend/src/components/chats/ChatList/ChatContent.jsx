import React from 'react';

const getTrimmedMessage = (content = '') => {
    if (content.length > 45) return `${content.substring(0, 45)}...`;
    return content;
};

const ChatContent = ({ chat, senderName, loggedUser, isSelected }) => {
  const latestMsg = chat?.latestMessage;



  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h3 className={`font-semibold text-sm truncate text-gray-700`}>
          {senderName}
        </h3>
      </div>

      {latestMsg && (
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate text-gray-500`}>
            <span className="font-medium">
              {latestMsg.sender.name === loggedUser.name ? 'You' : latestMsg.sender.name}:
            </span>
            <span className="ml-1">{getTrimmedMessage(latestMsg.content)}</span>
          </p>
        </div>
      )}
    </>
  );
};

export default ChatContent;
