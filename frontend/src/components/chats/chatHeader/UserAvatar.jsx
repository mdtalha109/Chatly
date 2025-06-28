import React from 'react';

const UserAvatar = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-10 h-10 rounded-full bg-gray-200"
  />
);

export default UserAvatar;
