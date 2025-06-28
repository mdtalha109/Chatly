import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { getSender } from '../../../config/chatLogics';
import UserAvatar from './UserAvatar';
import OnlineStatus from './OnlineStatus';

const ChatHeader = ({ setSelectedChat, user, selectedChat, isUserActive }) => {
  const sender = getSender(user, selectedChat?.users);

  return (
    <div className="flex items-center px-2 py-4" data-testid="chat-header">
      <section className="flex items-center gap-2 w-full">
        <button
          className="cursor-pointer"
          onClick={() => setSelectedChat("")}
          data-testid="back-button"
        >
          <IoIosArrowBack size={20} />
        </button>

        <div className="flex items-center gap-4">
          <UserAvatar src={sender.pic} alt={sender.name} />

          <div className="flex flex-col">
            <div className="font-medium text-base" data-testid="user-name">
              {sender.name}
            </div>
            <OnlineStatus isActive={isUserActive} />
          </div>
        </div>
      </section>
    </div>
  );
};


export default ChatHeader;
