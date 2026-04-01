import React, { useState } from 'react';
import useChatList from './hooks/useChatList';
import ChatListSkeleton from '../ChatListSkeleton';
import NoChatsAvailable from './NoChatsAvailable';
import ChatListContent from './ChatListContent';
import ChatListHeader from './ChatListHeader';
import ErrorLoadingChats from './ErrorLoadingChats';


import UserSearchModal from '../UserSearchModal';
import { useUserSearch } from './hooks/useUserSearch';


const ChatList = () => {
  const {
    chats,
    setSelectedChat,
    selectedChat,
    loggedUser,
    isLoading,
    error,
    retry
  } = useChatList();

  const [isUserSearchModalOpen, setIsUserSearchModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const filteredChats = chats?.filter((chat) =>
    chat.chatName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.users?.some(user => user.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

    const userSearchHook = useUserSearch({
    onChatCreated: (chat) => {
      setSelectedChat(chat);
      setIsUserSearchModalOpen(false);
    }
  });

  const handleModalClose = () => {
    setIsUserSearchModalOpen(false);
    userSearchHook.reset();
  };

  return (
    <>
    <div className="flex flex-col bg-white max-h-[90dvh] ">
      
        <ChatListHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsUserSearchModalOpen={setIsUserSearchModalOpen}/>

        <div className=" overflow-y-auto ">
          {error ? (
            <ErrorLoadingChats onRetry={retry} />
          ) : !chats || isLoading ? (
            <ChatListSkeleton />
          ) : filteredChats.length === 0 ? (
            <NoChatsAvailable message="No chats match your search." />
          ) : (
            <ChatListContent
              chats={filteredChats}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              loggedUser={loggedUser}
            />
          )}
        </div>
     
    </div>



     <UserSearchModal
        isOpen={isUserSearchModalOpen}
        onClose={handleModalClose}
        userSearchHook={userSearchHook}
      />


  </>
  );
};

export default ChatList;
