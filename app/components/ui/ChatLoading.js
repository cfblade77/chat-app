import React from 'react';

function ChatLoading({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className || ''}`}
      {...props}
    />
  );
}

export { ChatLoading };
