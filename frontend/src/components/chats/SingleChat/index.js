
import React from 'react'
import { Spinner } from '@chakra-ui/react'

import { ChatState } from '../../../Context/chatProvider';

import ScrollableChat from '../ScrollableChat';
import useSingleChat from './hooks/useSingleChat';
import ChatHeader from '../chatHeader';
import ChatFooter from '../ChatFooter';
import NonSelectedChat from '../NonSelectedChat';
import UploadImagePreview from '../UploadImagePreview';



const SingleChat = ({ setShowChatList, showChatList }) => {
    const { user } = ChatState()

    const {
        selectedChat,
        setSelectedChat,
        messages,
        loading,
        chatInputRef,
        image,
        newMessage,
        typingHandler,
        sendMessage,
        handleImageUpload,
        istyping,
        isUserActive,
        aiThinking  
    } = useSingleChat()


    return (
        <>
            {   selectedChat ? (
                <div className='h-screen w-full flex flex-col'>

                    {/* Chat Header */}
                    <ChatHeader
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        user={user}
                        isUserActive={isUserActive}
                    />

                    <div className="flex flex-col p-2 justify-end w-full bg-[#f8f9fa] items-stretch flex-1  overflow-hidden ">
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : <>


                            <ScrollableChat
                                messages={messages}
                            />

                        </>
                        }
                        {istyping ? 'typing' : null}

                        <div className="flex flex-col mt-10 md:gap-5 gap-2 items-stretch">
                            {
                                image ?
                                    <UploadImagePreview image={image} />
                                    : <></>
                            }
                            <ChatFooter
                                chatInputRef={chatInputRef}
                                selectedChat={selectedChat}
                                typingHandler={typingHandler}
                                newMessage={newMessage}
                                sendMessage={sendMessage}
                                handleImageUpload={handleImageUpload}
                                aiThinking={aiThinking}
                            />
                        </div>

                    </div>
                </div>
                ) : (
                    <NonSelectedChat
                        selectedChat={selectedChat}
                        showChatList={showChatList}
                        setShowChatList={setShowChatList} />
                )
            }
        </>
    )
}

export default SingleChat
