import React from "react";
import ChatList from "../chats/ChatList";
import SidebarHeader from "../chats/SidebarHeader";

const STYLES = {
  sidebar: {
    base: " md:w-[25%] border-r-[1px] border-r-gray",
    visible: "w-[100%] md:w-[30%]",
    hidden: "md:block hidden",
    withSelectedChat: "md:block hidden"
  }
};

const ChatSidebar = ({ showChatList, selectedChat, onLogout }) => {
  const sidebarClasses = [
    STYLES.sidebar.base,
    showChatList ? STYLES.sidebar.visible : STYLES.sidebar.hidden,
    selectedChat ? STYLES.sidebar.withSelectedChat : ''
  ].join(' ');

  return (
    <div className={sidebarClasses}>
      <SidebarHeader onLogout={onLogout} />
      <ChatList />
    </div>
  );
};

export default ChatSidebar;