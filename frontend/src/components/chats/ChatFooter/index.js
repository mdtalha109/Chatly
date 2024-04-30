
import React from 'react'
import { IoCamera, IoSend } from 'react-icons/io5'
import { Button, Input } from '../../ui'

const ChatFooter = ({chatInputRef, typingHandler, newMessage, sendMessage, handleImageUpload}) => {
    return (
        <div className='flex md:gap-5 gap-2 items-stretch'>
            <Input
                ref={chatInputRef}
                className="flex-1"
                placeholder='Enter a message...'
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : ''}
                tabindex={0}
            />
            <Input
                type="file"
                id='file'
                placeholder="Upload your profile picture"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files[0])}

            />
            <label className='flex justify-center items-center text-2xl cursor-pointer' htmlFor='file' tabindex={0}><IoCamera /></label>
            <Button className='md:w-[5%] w-[15%] outline-2 focus:outline-black' onClick={sendMessage} tabindex={0}>  <IoSend /> </Button>
        </div>
    )
}

export default ChatFooter