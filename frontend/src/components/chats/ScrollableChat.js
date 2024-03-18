import React, { useEffect, useRef } from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/chatLogics'
import { ChatState } from '../../Context/chatProvider'
import { motion } from "framer-motion";

const ScrollableChat = ({ messages }) => {
  console.log('messages: ', messages)
  const { user } = ChatState()
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className='overflow-y-auto scroll-smooth'>
      {messages &&
        messages.map((m, i) => (
          <div ref={scrollRef} className='flex items-center' key={i}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <img
                  src={m.sender.pic}
                  alt='pic'
                  className={`rounded-full h-8 w-8 `}
               />

            )}

            <motion.div
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#0EA487" : "#2B3856"
                  }`,
                color: "white",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "5px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ ease: "easeOut", duration: 2 }}
            >
              {m.image ? <img src={m.image} alt='message_image' className=' h-[450px] object-contain w-max'/> : <></>}
              {m.content}

              
              
            </motion.div>
          </div>
        ))}
    </div>
  )
}

export default ScrollableChat
