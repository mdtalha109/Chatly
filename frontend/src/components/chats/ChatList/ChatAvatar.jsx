import React from 'react';
import { User } from 'lucide-react';

const ChatAvatar = ({ sender, isOnline }) => {
  return (
    <div className="relative flex-shrink-0">
      {sender?.pic ? (
        <img
          className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          src={sender.pic}
          alt={sender.name}
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
      {isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

export default ChatAvatar;
