import { memo } from "react";

const MessageImage = memo(({ src, senderName }) => {
  const handleError = (e) => {
    console.error('Failed to load message image:', e.target.src);
    e.target.style.display = 'none';
  };

  return (
    <img 
      src={src} 
      alt={`Image shared by ${senderName || 'User'}`}
      className="h-[450px] object-contain w-max"
      loading="lazy"
      onError={handleError}
    />
  );
});

export default MessageImage;