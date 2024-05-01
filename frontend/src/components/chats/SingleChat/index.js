
import React from 'react'
import { Spinner } from '@chakra-ui/react'

import { ChatState } from '../../../Context/chatProvider';

import ScrollableChat from '../ScrollableChat';
import useSingleChat from './hooks/useSingleChat';
import ChatHeader from '../chatHeader';
import ChatFooter from '../ChatFooter';
import NonSelectedChat from '../NonSelectedChat';
import UploadImagePreview from '../UploadImagePreview';



const SingleChat = ({ fetchAgain, setFetchAgain, setShowChatList, showChatList }) => {
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
    } = useSingleChat(fetchAgain, setFetchAgain)


    return (
        <>
            {   selectedChat ? (
                    <div className='h-full w-full flex flex-col'>

                        {/* Chat Header */}
                        <ChatHeader
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                            user={user}
                            isUserActive={isUserActive}
                        />

                        <div className="flex flex-col p-2 justify-end w-full bg-[#E8E8E8] items-stretch flex-1  overflow-y-scroll">
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : <>

                                {/* Main chat body */}
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
                                    typingHandler={typingHandler}
                                    newMessage={newMessage}
                                    sendMessage={sendMessage}
                                    handleImageUpload={handleImageUpload} />
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
