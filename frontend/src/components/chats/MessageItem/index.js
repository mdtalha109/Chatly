import React, { memo } from 'react';
import { 
  isLastMessage, 
  isSameSender, 
  isSameSenderMargin, 
  isSameUser 
} from '../../../config/chatLogics';
import MessageAvatar from './MessageAvatar';
import MessageTimestamp from './MessageTimestamp';
import MessageText from './MessageText';
import MessageImage from './MessageImage';


const useMessageLayout = (messages, message, index, userId) => {
  return {
    isCurrentUser: message.sender?._id === userId,
    shouldShowAvatar: isSameSender(messages, message, index, userId) || 
                     isLastMessage(messages, index, userId),
    marginLeft: isSameSenderMargin(messages, message, index, userId),
    marginTop: isSameUser(messages, message, index, userId) ? 5 : 10,
  };
};

const useMessageStyles = (isCurrentUser, marginLeft, marginTop) => {
  return {
    container: `
      relative max-w-[75%] rounded-md border border-gray-200 p-2 pr-16
      ${isCurrentUser 
        ? 'bg-blue-500 text-white' 
        : 'bg-white text-black'
      }
    `,
    spacing: {
      marginLeft,
      marginTop,
      marginRight: 10,
    }
  };
};

const MessageItem = memo(({ 
  messages, 
  message, 
  index, 
  user, 
  scrollRef,
  className = '',
  ...props 
}) => {

  const { 
    isCurrentUser, 
    shouldShowAvatar, 
    marginLeft, 
    marginTop 
  } = useMessageLayout(messages, message, index, user._id);

  
  const { container, spacing } = useMessageStyles(isCurrentUser, marginLeft, marginTop);

  if (!message || !user) {
    console.warn('MessageItem: Missing required props');
    return null;
  }

  return (
    <div 
      className={`flex items-end gap-2 ${className}`}
      ref={scrollRef}
      role="listitem"
      aria-label={`Message from ${message.sender?.name || 'Unknown user'}`}
      {...props}
    >
      {/* <MessageAvatar
        sender={message.sender} 
        shouldShow={shouldShowAvatar} 
      /> */}

      <div 
        className={container}
        style={spacing}
        role="article"
        aria-labelledby={`message-${index}`}
      >
        <div id={`message-${index}`}>
          {message.image ? (
            <MessageImage
              src={message.image} 
              senderName={message.sender?.name} 
            />
          ) : (
            <MessageText content={message.content} />
          )}

          <MessageTimestamp 
            createdAt={message.createdAt} 
            isCurrentUser={isCurrentUser} 
          />
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';


export default MessageItem;
