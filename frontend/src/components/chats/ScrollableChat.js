import React, { useEffect, useRef } from 'react'
import { ChatState } from '../../Context/chatProvider'
import MessageItem from './MessageItem';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState()
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className='overflow-y-auto '>
      {messages &&
        messages.map((message, index) => (
          <>
            <MessageItem
              scrollRef={scrollRef}
              messages={messages}
              message={message}
              index={index}
              user={user}
            />

          </>
        ))}
    </div>
  )
}

export default ScrollableChat