import React from 'react';
import { Button, Input } from '../../ui';
import { Plus } from 'lucide-react';

const ChatListHeader = ({ searchTerm, setSearchTerm, setIsUserSearchModalOpen }) => {
  return (
    <div className="px-6 py-4 space-y-4">
      <Button className="w-full" onClick={() => setIsUserSearchModalOpen(true)}>
        <Plus /> New Chat
      </Button>
      <Input
        type="text"
        placeholder="Search chats..."
        className="w-full bg-gray-100"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ChatListHeader;
