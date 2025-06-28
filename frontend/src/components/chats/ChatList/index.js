import React from 'react';
import useChatList from './hooks/useChatList';
import ChatListSkeleton from '../ChatListSkeleton';
import NoChatsAvailable from './NoChatsAvailable';
import EmptyState from './NoChatsAvailable';
import ChatListContent from './ChatListContent';

const ChatList = ({ fetchAgain }) => {
  const {
    chats,
    setSelectedChat,
    selectedChat,
    loggedUser
  } = useChatList(fetchAgain);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col bg-white w-full h-full overflow-hidden">
        {!chats ? (
          <ChatListSkeleton />
        ) : chats.length === 0 ? (
          <NoChatsAvailable message="No chat available" />
        ) : (
          <ChatListContent
            chats={chats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            loggedUser={loggedUser}
          />
        )}
      </div>
    </div>
  );
};

export default ChatList;
