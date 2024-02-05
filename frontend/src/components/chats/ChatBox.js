import React from 'react'
import { ChatState } from '../../Context/chatProvider'
import SingleChat from './SingleChat'


const ChatBox = ({fetchAgain, setfetchAgain,setShowChatList, showChatList}) => {
    const {selectedChat} = ChatState()
    return (
        <div className={`md:flex   items-center bg-white  w-full h-full  border-b-2`}      
        >
            <SingleChat fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain} setShowChatList={setShowChatList} showChatList={showChatList}/>
        </div>
    )
}

export default ChatBox
