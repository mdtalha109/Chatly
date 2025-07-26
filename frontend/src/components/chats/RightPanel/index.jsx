import ChatBox from "../ChatBox";

const STYLES = {
  rightPanel: {
    base: "flex flex-1 md:max-w-[75%] overflow-y-hidden bg-blue-700",
    withSelectedChat: "md:block block"
  }
};

const RightPanel = ({ selectedChat, showChatList, setShowChatList }) => {
  const rightPanelClasses = [
    STYLES.rightPanel.base,
    selectedChat ? STYLES.rightPanel.withSelectedChat : ''
  ].join(' ');

  return (
    <div className={rightPanelClasses}>
      <ChatBox 
        setShowChatList={setShowChatList} 
        showChatList={showChatList} 
      />
    </div>
  );
};

export default RightPanel