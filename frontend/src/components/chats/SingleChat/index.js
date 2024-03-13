
import React from 'react'
import { Spinner} from '@chakra-ui/react'

import { IoSend } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

import { ChatState } from '../../../Context/chatProvider';
import { Button, Input } from '../../ui'

import ScrollableChat from '../ScrollableChat';
import useSingleChat from './hooks/useSingleChat';



const SingleChat = ({ fetchAgain, setFetchAgain, setShowChatList, showChatList }) => {
    const { user } = ChatState()
    
    const {
        selectedChat,
        setSelectedChat,
        getSender,
        messages,
        loading,
        chatInputRef,
        newMessage,
        typingHandler,
        sendMessage,
    } = useSingleChat(fetchAgain, setFetchAgain)


    return (
        <>
            {selectedChat ? ( 
                <div className='h-full w-full flex flex-col'>
                    <div className='flex px-2 py-4 items-center gap-2'>
                        
                        <div className='cursor-pointer'>
                            <IoIosArrowBack onClick={() => setSelectedChat("")}/>
                        </div>
                        
                        <span className='font-bold'>{getSender(user, selectedChat.users).name}</span>

                    </div>
                    <div className="flex flex-col p-2 justify-end w-full bg-[#E8E8E8] items-stretch flex-1  overflow-y-scroll">
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                            ) : (
                                <ScrollableChat messages={messages} />
                            )
                        }
                       
                        <div className="flex mt-10 md:gap-5 gap-2 items-stretch">
                            <Input
                                ref={chatInputRef}
                                className="flex-1"
                                placeholder='Enter a message...'
                                onChange={typingHandler}
                                value={newMessage}
                                onKeyDown= {(e) => e.key === 'Enter' ? sendMessage(): ''}
                            />
                            <Button className='md:w-[5%] w-[15%]' onClick={sendMessage}>  <IoSend /> </Button>
                        </div>
                        
                    </div>
                </div>
            ) : (
                <div className={`flex flex-col gap-2 items-center justify-center bg-[#E8E8E8] w-full h-full ${(selectedChat ||  showChatList) ? 'hidden': 'w-[100%]' }`}>
                    <div>
                        <img src='http://res.cloudinary.com/talhapro321/image/upload/v1707127552/nkxpjiwsujz0rkbe7p1k.png' alt='omg'/>
                    </div>
                    <div>
                        <h2 className='text-4xl font-extrabold'>Welcome to Chatly</h2>
                    </div>
                  
                   <div className='text-center text-lg text-slate-500'>Select a chat to read messages or start a new <br/> conversation. Enjoy chatting</div>
                   <Button className='md:hidden' onClick={() =>setShowChatList(true)}>Start Chatting</Button>
                </div>
            )
            }
        </>
    )
}

export default SingleChat
