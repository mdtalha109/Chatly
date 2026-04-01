import { SocketProvider } from "../../Context/SocketProvider";

const ChatLayout = ({ children, user }) => {
  if (!user) return null;
  
  return (
    <SocketProvider>
      <div className="flex w-full max-h-[100dvh] overflow-hidden">
        {children}
      </div>
    </SocketProvider>
  );
};

export default ChatLayout;