import React from 'react'
import { Button } from '../../ui'

const NonSelectedChat = ({selectedChat, showChatList, setShowChatList}) => {
    return (
        <div className={`flex flex-col gap-2 items-center justify-center bg-[#E8E8E8] w-full h-full ${(selectedChat || showChatList) ? 'hidden' : 'w-[100%]'}`}>
            <div>
                <img src='http://res.cloudinary.com/talhapro321/image/upload/v1707127552/nkxpjiwsujz0rkbe7p1k.png'
                    alt='img'
                    className='w-[100%] h-[100%] object-contain' />
            </div>
            <div>
                <h2 className='text-4xl font-extrabold'>Welcome to Chatly</h2>
            </div>

            <div className='text-center text-lg text-slate-500'>Select a chat to read messages or start a new <br /> conversation. Enjoy chatting</div>
            <Button className='md:hidden' onClick={() => setShowChatList(true)}>Start Chatting</Button>
        </div>
    )
}

export default NonSelectedChat