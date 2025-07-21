import React from 'react'
import SingleChat from './SingleChat'


const ChatBox = ({setShowChatList, showChatList}) => {
    return (
        <div className={`md:flex   items-center bg-white  w-full h-full  border-b-2`}>
            <SingleChat setShowChatList={setShowChatList} showChatList={showChatList}/>
        </div>
    )
}

export default ChatBox
