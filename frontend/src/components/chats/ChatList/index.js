import React from 'react'
import { Avatar, Skeleton } from '@chakra-ui/react';
import useChatList from './hooks/useChatList';

const ChatList = ({ fetchAgain }) => {

    const {
        chats, 
        setSelectedChat,
        selectedChat,
        getSender,
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
              <div className={`px-5 py-3 flex items-center gap-4 cursor-pointer ${selectedChat === chat ? "bg-[#e8e8e9]" : "#E8E8E8"} border-b-2`} 
                onKeyPress={() => setSelectedChat(chat)}
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                tabindex={0}
              >
                <img class="h-10 w-10 rounded-full object-cover" src={getSender(loggedUser, chat.users)?.pic} alt={getSender(loggedUser, chat.users)?.name}/>

                <div className='flex flex-col gap-2'>
                  <p className='font-bold'>
                    {chat
                      ? getSender(loggedUser, chat.users)?.name
                      : chat.chatName
                    }
                  </p>

                  {chat.latestMessage && (
                    <p className='text-xs'>
                      {chat?.latestMessage?.sender?.name} :
                      {chat?.latestMessage?.content?.length > 50
                        ? chat?.latestMessage?.content?.substring(0, 51) + "..."
                        : chat?.latestMessage?.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
            )
        ) : (
          <div className='flex flex-col gap-2'>
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />
            <Skeleton height="45px" />

          </div>
        )}
      </div>
    </div>
  )
}

export default ChatList
