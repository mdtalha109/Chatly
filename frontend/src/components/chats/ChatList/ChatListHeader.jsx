import React from 'react';
import { Button, Input } from '../../ui';
import { Plus, Search } from 'lucide-react';

const ChatListHeader = ({ searchTerm, setSearchTerm, setIsUserSearchModalOpen }) => {
  return (
    <div className="px-4 py-4 space-y-3">
      <Input
        type="text"
        placeholder="Search chats..."
        className="w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        filled
        bordered={false}
        leftAddon={<Search className="w-4 h-4 text-gray-400" />}
      />
      <Button className="w-full" onClick={() => setIsUserSearchModalOpen(true)}>
        <Plus className='w-5 h-5' /> New Chat
      </Button>
      
    </div>
  );
};

export default ChatListHeader;
