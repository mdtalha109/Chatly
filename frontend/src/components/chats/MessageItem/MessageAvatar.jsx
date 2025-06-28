import React, { memo } from "react";

const MessageAvatar = memo(({ sender, shouldShow }) => {
  if (!shouldShow || !sender?.pic) return null;

  const handleError = (e) => {
    console.warn('Avatar failed to load:', e.target.src);
    e.target.style.display = 'none';
  };

  return (
    <img
      src={sender?.pic}
      alt={`${sender?.name || 'User'} avatar`}
      className="rounded-full h-8 w-8 flex-shrink-0"
      loading="lazy"
      onError={handleError}
    />
  );
});

export default MessageAvatar;