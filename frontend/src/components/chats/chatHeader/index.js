import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { getSender } from '../../../config/chatLogics'

const ChatHeader = ({setSelectedChat, user, selectedChat, isUserActive}) => {
    return (
        <div className='flex px-2 py-4 items-center gap-2'>

            <div className='cursor-pointer'>
                <IoIosArrowBack onClick={() => setSelectedChat("")} />
            </div>
            <section className='flex flex-col'>
                <div className='font-bold'>{getSender(user, selectedChat.users).name}</div>
                {isUserActive ? <div className='text-green-500'>Online</div> : ''}
            </section>


        </div>
    )
}

export default ChatHeader