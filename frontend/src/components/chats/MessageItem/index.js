import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../../config/chatLogics'

const MessageItem = ({ messages, message, index, user, scrollRef }) => {
    return (
        <div className='flex items-center ' key={index} ref={scrollRef}>
            {(isSameSender(messages, message, index, user._id) || isLastMessage(messages, index, user._id)) && (
                    <img
                        src={message.sender.pic}
                        alt='pic'
                        className={`rounded-full h-8 w-8 `}
                    />

                )}

            <div
                style={{
                    backgroundColor: `${message.sender._id === user._id ? "#0EA487" : "#2B3856"
                        }`,
                    color: "white",
                    marginLeft: isSameSenderMargin(messages, message, index, user._id),
                    marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10,
                    borderRadius: "5px",
                    padding: "7px 20px",
                    maxWidth: "75%",
                }}
            >
                {message.image ? <img src={message.image} alt={message.image} className=' h-[450px] object-contain w-max' /> : <></>}
                {message.content}

            </div>
        </div>
    )
}

export default MessageItem