import React, { memo } from 'react'

const MessageText = memo(({ content }) => (
  <span className="break-words whitespace-pre-wrap">
    {content || ''}
  </span>
));

export default MessageText;