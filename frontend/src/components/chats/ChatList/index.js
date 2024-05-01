import React from 'react'

import useChatList from './hooks/useChatList';
import ChatListSkeleton from '../ChatListSkeleton';
import ChatListItem from '../ChatListItem';

const ChatList = ({ fetchAgain }) => {

  const {
    chats,
    setSelectedChat,
    selectedChat,
    loggedUser
  } = useChatList(fetchAgain)


  return (
    <div className={`flex flex-col items-center w-full visible`}
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}

    >
      <div className='flex flex-col  bg-[#F8F8F8] w-full h-full overflow-hidden'>
        {chats ? (
          chats.length === 0 ? (
            <div className='flex justify-center items-center h-[100vh]'>
              <h1>No chat available</h1>
            </div>
          )
            : (
              <div>
                {chats.map((chat) => (
                 <ChatListItem
                    chat={chat}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    loggedUser={loggedUser}
                  />
                ))}
              </div>
            )
        ) : (
          <ChatListSkeleton />
        )}
      </div>
    </div>
  )
}

export default ChatList
