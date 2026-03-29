
import React from 'react'
import { IoCamera, IoSend } from 'react-icons/io5'
import { Button, Input } from '../../ui'

const ChatFooter = ({chatInputRef, typingHandler, selectedChat, newMessage, sendMessage, handleImageUpload, aiThinking}) => {
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex md:gap-5 gap-2 items-stretch'>
                <Input
                    ref={chatInputRef}
                    className="flex-1"
                    placeholder={selectedChat?.chatType === 'pdf' ? `Ask a question about this PDF.....` : 'Enter a message...'}  
                    onChange={typingHandler}
                    value={newMessage}
                    onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : ''}
                    tabindex={0}
                    disabled={aiThinking}
                />
                <Input
                    type="file"
                    id='file'
                    placeholder="Upload your profile picture"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}

                />
                <label className={`flex justify-center items-center text-2xl cursor-pointer ${selectedChat?.chatType === 'pdf' ? 'hidden' : ''}`} htmlFor='file' tabindex={0}><IoCamera /></label>
                <Button 
                    className='md:w-[5%] w-[15%] outline-2 focus:outline-black' 
                    onClick={sendMessage} 
                    tabindex={0}
                    disabled={aiThinking}
                >
                    <IoSend /> 
                </Button>
            </div>
            {aiThinking && selectedChat?.chatType === 'pdf' && (
                <div className="text-sm text-gray-500 flex items-center gap-2 px-2">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span>AI is responding...</span>
                </div>
            )}
        </div>
    )
}

export default ChatFooter