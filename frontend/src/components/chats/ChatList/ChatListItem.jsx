import React from 'react';
import { getSender } from '../../../config/chatLogics';
import useSocket from '../../../hooks/useSocket';
import ChatAvatar from './ChatAvatar';
import ChatContent from './ChatContent';
import ChatTimestamp from './ChatTimestamp';

export const getSenderName = (loggedUser, chat) => {
  if (!chat.isGroupChat) {
    const otherUser = chat.users.find((u) => u._id !== loggedUser._id);
    return otherUser?.name || 'Unknown';
  }
  return chat.chatName;
};

const ChatListItem = ({ chat, setSelectedChat, loggedUser, selectedChat }) => {
  const sender = getSender(loggedUser, chat.users);
  const isSelected = selectedChat?._id === chat._id;

  const { userStatuses } = useSocket();
  const isUserActive = userStatuses?.includes(sender?._id);

  const handleSelect = () => setSelectedChat(chat);

  return (
    <div
      className={`
        group relative flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-gray-100
        ${isSelected ? 'border-r-4 border-r-blue-600 bg-[#eff6ff]' : ''}
      `}
      onClick={handleSelect}
      onKeyDown={(e) => e.key === 'Enter' && handleSelect()}
      tabIndex={0}
      role="button"
      aria-label={`Chat with ${sender?.name}`}
    >
      <ChatAvatar sender={sender} isOnline={isUserActive} />
      <div className="flex-1 min-w-0">
        <ChatContent
          chat={chat}
          senderName={getSenderName(loggedUser, chat)}
          loggedUser={loggedUser}
          isSelected={isSelected}
        />
      </div>
      <ChatTimestamp chat={chat} isSelected={isSelected} />
    </div>
  );
};

export default ChatListItem;
