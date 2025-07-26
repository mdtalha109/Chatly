import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/chatProvider";

import { useAuth } from "../hooks/useAuth";
import ChatLayout from "../components/layout/ChatLayout";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import RightPanel from "../components/chats/RightPanel";


const ChatPage = () => {

    const [showChatList, setShowChatList] = useState(false)
    const { selectedChat, user } = ChatState();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }

    useAuth();

    return (
        <>
             <ChatLayout user={user}>
             
                <ChatSidebar
                    showChatList={showChatList}
                    selectedChat={selectedChat}
                    onLogout={handleLogout}
                />

                <RightPanel
                    selectedChat={selectedChat}
                    showChatList={showChatList}
                    setShowChatList={setShowChatList}
                />
            </ChatLayout>
        </>

    )
}

export default ChatPage
