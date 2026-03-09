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



      {latestMsg && latestMsg?.sender?.name == loggedUser?.name &&(
          <p className={`text-xs truncate text-gray-500`}>
            <span className="">{getTrimmedMessage(latestMsg?.content)}</span>
          </p>
      )}
    </>
  );
};

export default ChatContent;
