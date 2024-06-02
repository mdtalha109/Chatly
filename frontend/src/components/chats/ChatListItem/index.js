import React from 'react'
import { getSender } from '../../../config/chatLogics'
import { formatDateTime } from '../../../utils/time'
import moment from 'moment'

const ChatListItem = ({chat, setSelectedChat, loggedUser, selectedChat}) => {
  return (
    <div className={`px-5 py-3 flex items-center justify-between  cursor-pointer ${selectedChat === chat ? "bg-[#e8e8e9]" : "#E8E8E8"} border-b-2`}
    onKeyPress={() => setSelectedChat(chat)}
    onClick={() => setSelectedChat(chat)}
    key={chat._id}
    tabindex={0}
  >
    <section className='flex gap-4'>
      <img class="h-10 w-10 rounded-full object-cover" src={getSender(loggedUser, chat.users)?.pic} alt={getSender(loggedUser, chat.users)?.name} />

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
    </section>
    <span className='text-xs'>{formatDateTime(moment(chat?.latestMessage?.createdAt))}</span>
  </div>
  )
}

export default ChatListItem