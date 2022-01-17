import { Box } from "@chakra-ui/layout"
import SideDrawer from "../components/chats/SideDrawer"
import MyChats from "../components/chats/MyChats.js"
import ChatBox from "../components/chats/ChatBox.js"

import { ChatState } from "../Context/chatProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const ChatPage = () => {

    const { user } = ChatState();
    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        

        if(!userInfo) navigate('/')
    }, [navigate]);
    

    return (
        <div style={{width: "100%"}}>
            {user && <SideDrawer/>}
            <Box d="flex" bg='#6b9cff' justifyContent="space-between" w="100%" h="91.5vh">
                {user && <MyChats/> }
                {user && <ChatBox/>}
                
            </Box>
        </div>
    )
}

export default ChatPage
