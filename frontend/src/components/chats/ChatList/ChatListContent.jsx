import React from 'react';
import ChatListItem from './ChatListItem';

const ChatListContent = ({ chats, selectedChat, setSelectedChat, loggedUser }) => {
  return (
    <div className="flex flex-col divide-y border-t-2">
      {chats.map((chat) => (
        <ChatListItem
          key={chat._id}
          chat={chat}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          loggedUser={loggedUser}
        />
      ))}
    </div>
  );
};

export default ChatListContent;
