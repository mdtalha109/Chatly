import React from "react";
import ChatList from "../chats/ChatList";
import SidebarHeader from "../chats/SidebarHeader";

const ChatSidebar = ({ showChatList, selectedChat, onLogout }) => {

  return (
    <div className={`md:w-[25%] border-r-[1px] border-r-gray flex flex-col`}>
      <SidebarHeader onLogout={onLogout} />
      <ChatList />
    </div>
  );
};

export default ChatSidebar;