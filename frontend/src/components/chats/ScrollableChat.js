import React, { useEffect, useRef } from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/chatLogics'
import { ChatState } from '../../Context/chatProvider'
import { motion } from "framer-motion";
import MessageItem from './MessageItem';

const ScrollableChat = ({ messages, scrollHandler, cursorRef }) => {

  const { user } = ChatState()
  const scrollRef = useRef();
  const parentRef = useRef()
  const previousScrollPosition = useRef(0);


  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);




  return (
    <div className='overflow-y-auto ' ref={parentRef}>
      {messages &&
        messages.map((message, index) => (
          <>
            <MessageItem
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