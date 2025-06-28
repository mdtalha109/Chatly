import React from 'react';
import { Clock } from 'lucide-react';
import { formatDateTime } from '../../../utils/time';

const ChatTimestamp = ({ chat, isSelected }) => {
  if (!chat.latestMessage) return null;

  return (
    <span className={`text-sm text-gray-400`}>
      <Clock className="w-3 h-3 inline mr-1" />
      {formatDateTime(new Date(chat.latestMessage.createdAt))}
    </span>
  );
};

export default ChatTimestamp;
