import React, { memo } from 'react'

const MessageText = memo(({ content, isStreaming }) => {
  if (!content) return null;

  const lines = content.split('\n');
  
  return (
    <span className="whitespace-pre-wrap break-words">
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
});

export default MessageText;