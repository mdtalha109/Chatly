import React, { memo } from 'react'
import { formatDateTime } from '../../../utils/time';
import moment from 'moment';

const MessageTimestamp = memo(({ createdAt, isCurrentUser }) => {
  if (!createdAt) return null;

  const timeString = formatDateTime(moment(createdAt));

  console.log("timeString: ", timeString)
  
  return (
    <time 
      dateTime={moment(createdAt).toISOString()}
      className={`
        absolute right-1 bottom-0.5 text-xs
        ${isCurrentUser ? 'text-white opacity-70' : 'text-gray-400'}
      `}
      aria-label={`Sent at ${timeString}`}
    >
      {timeString}
    </time>
  );
});

export default MessageTimestamp;