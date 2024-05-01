import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { getSender } from '../../../config/chatLogics'

const ChatHeader = ({ setSelectedChat, user, selectedChat, isUserActive }) => {
    return (
        <div className='flex px-2 py-4 items-center justify-between'>

            <seaction className='flex items-center gap-2'>
                <div className='cursor-pointer'>
                    <IoIosArrowBack onClick={() => setSelectedChat("")} />
                </div>
                <div className='flex flex-col '>
                    <div className={`font-bold ${isUserActive ? 'text-sm' : ''}  `}>{getSender(user, selectedChat.users).name}</div>
                    {isUserActive ? <div className='text-green-500 text-xs duration-1000'>Online</div> : ''}
                </div>
            </seaction>
        </div>
    )
}

export default ChatHeader