import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";

import ChatBox from '../components/chats/ChatBox'
import ChatList from "../components/chats/ChatList/index";
import { Settings } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ChatLayout from "../components/layout/ChatLayout";


const ChatPage = () => {

    const [showChatList, setShowChatList] = useState(false)
    const { selectedChat, user } = ChatState();

    useAuth();

    return (
        <>
             <ChatLayout user={user}>
                <div className={`flex md:w-[25%] ${(showChatList) ? 'w-[100%] md:w-[30%]' : 'md:block hidden'} ${selectedChat ? 'md:block hidden' : ''}  `}>
                    <div className="h-16 flex justify-between items-center px-6 border-b-[1px] border-b-gray border-r-[1px] border-r-gray">
                        <div className="text-2xl">
                            Chatly
                        </div>

                        <div className="flex gap-2">
                            <Settings />
                        </div>
                    </div>
                    <ChatList />
                </div>

                <div className={`flex flex-1 md:max-w-[75%] overflow-y-hidden  bg-blue-700  ${(selectedChat) ? 'md:block block' : ''}`} >
                    <ChatBox setShowChatList={setShowChatList} showChatList={showChatList} />
                </div>
            </ChatLayout>
        </>

    )
}

export default ChatPage
