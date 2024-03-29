import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/chatProvider";

import ChatBox from '../components/chats/ChatBox'
import ChatList from "../components/chats/ChatList/index";
import Header from "../components/Header/Header";


const ChatPage = () => {

    
    const navigate = useNavigate()
    const [fetchAgain, setfetchAgain] = useState(false);
    const [showChatList, setShowChatList] = useState(false)


    const { selectedChat, user } = ChatState();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) navigate('/')
    }, [navigate]);

    return (
        <>
            {user && <Header />}
            {user &&
                <div>
                    <div className="flex w-full h-[90vh]" >
                        <div className={`flex md:w-[30%] ${(showChatList) ? 'w-[100%] md:w-[30%]': 'md:block hidden' } ${selectedChat ? 'md:block hidden' : ''}  `}>
                            <ChatList fetchAgain={fetchAgain} />

                        </div>

                        <div className={`flex flex-1 md:max-w-[70%] overflow-y-hidden  bg-blue-700  ${(selectedChat ) ? 'md:block block' : ''}` } >
                            <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}  setShowChatList={setShowChatList} showChatList={showChatList}/>
                        </div>
                    </div>
                </div>
            }

        </>

    )
}

export default ChatPage
