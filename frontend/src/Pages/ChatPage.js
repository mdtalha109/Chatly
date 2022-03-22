import { Box } from "@chakra-ui/layout"
import SideDrawer from "../components/chats/SideDrawer"
import MyChats from "../components/chats/MyChats.js"
import ChatBox from "../components/chats/ChatBox.js"

import { ChatState } from "../Context/chatProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { position } from "@chakra-ui/react";


const ChatPage = () => {

    const { user } = ChatState();
    const navigate = useNavigate()
    const [fetchAgain, setfetchAgain] = useState(false)

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(!userInfo) navigate('/')
    }, [navigate]);
    

    return (
        <>

            
    
         
            {user && <SideDrawer/>}
            <div >
                    <Box d="flex" justifyContent="space-between" w="100%" h="90vh" >
                        {user && <MyChats fetchAgain = {fetchAgain} /> }
                        {user && <ChatBox fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain}/>} 
                    </Box>
            </div>
         </>
    
    )
}

export default ChatPage
