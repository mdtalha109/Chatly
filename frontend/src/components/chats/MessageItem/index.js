import React from 'react'
import moment from 'moment'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../../config/chatLogics'
import { formatDateTime } from '../../../utils/time'
import './MessageItem.css'


const MessageItem = ({ messages, message, index, user, scrollRef }) => {
    return (
        <div className='flex items-center gap-2' key={index} ref={scrollRef}>
            {(isSameSender(messages, message, index, user._id) || isLastMessage(messages, index, user._id)) && (
                <img
                    src={message.sender.pic}
                    alt='pic'
                    className='rounded-full h-8 w-8'
                />
            )}

            <div
                className={`${message.sender._id === user._id ? "right-bubble" : "left-bubble"}`}
                style={{
                    
                    backgroundColor: `${message.sender._id === user._id ? "#0EA487" : "#2B3856"}`,
                    color: "white",
                    marginLeft: isSameSenderMargin(messages, message, index, user._id),
                    marginTop: isSameUser(messages, message, index, user._id) ? 5 : 10,
                    marginRight: "10px",
                    borderRadius: "5px",
                    padding: "7px 20px",
                    paddingRight: "70px",
                    maxWidth: "75%",
                    // position: "relative",
                    
                }}
            >
                <div>
                    {message.image ? (
                        <img src={message.image} alt={message.image} className='h-[450px] object-contain w-max' />
                    ) : (
                        <span>{message.content}</span>
                    )}
                    <div style={{ fontSize: '0.8em', color: '#e0e0e0', position: 'absolute', right: '5px', bottom: "2px" }}>
                        {formatDateTime(moment(message.createdAt))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageItem
