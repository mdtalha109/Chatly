import React, { useState } from 'react';
import { Button, Input } from '../../ui';
import { Plus, Search, FileText } from 'lucide-react';
import PdfUploadModal from '../PdfUploadModal';

const ChatListHeader = ({ searchTerm, setSearchTerm, setIsUserSearchModalOpen }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);

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
      <div className="flex gap-2">
        <Button className="flex-1" onClick={() => setIsUserSearchModalOpen(true)}>
          <Plus className='w-5 h-5' /> New Chat
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setShowPdfModal(true)}>
          <FileText className='w-5 h-5' /> PDF Chat
        </Button>
      </div>

      {
        <PdfUploadModal isOpen={showPdfModal} onClose={() => setShowPdfModal(false)} />
      }
    </div>
  );
};

export default ChatListHeader;
