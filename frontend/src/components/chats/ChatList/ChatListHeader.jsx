import React from 'react';
import { Button } from '../../ui';
import { Plus } from 'lucide-react';

const ChatListHeader = ({ searchTerm, setSearchTerm, setIsUserSearchModalOpen }) => {
  return (
    <div className="px-6 py-4 space-y-4">
      <Button className="w-full" onClick={() => setIsUserSearchModalOpen(true)}>
        <Plus /> New Chat
      </Button>
      <input
        type="text"
        placeholder="Search chats..."
        className="w-full bg-gray-muted px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ChatListHeader;
