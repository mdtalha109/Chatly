import React, { memo } from 'react'

const MessageText = memo(({ content, isStreaming }) => (
  <span className="">
    {content || ''}  </span>
));

export default MessageText;