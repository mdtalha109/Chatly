
import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { io } from "socket.io-client";

import { ChatState } from '../../../../Context/chatProvider';
import { getSender } from '../../../../config/chatLogics';
import { BaseConfig } from '../../../../config/baseConfig';
import { socketEvent } from '../../../../constant/socket';


const ENDPOINT = BaseConfig.BASE_SERVER_URL
var socket, selectedChatCompare;

const useSingleChat = (fetchAgain, setfetchAgain) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [image, setImage] = useState(null)
    const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [isUserActive, setUserisActive] = useState(false)

    const chatInputRef = useRef(null)



    useEffect(() => {

        socket = io(ENDPOINT);
        socket.emit(socketEvent.SETUP, user)
        socket.on(socketEvent.CONNECTED, () => {
            setSocketConnected(true);

        })
        socket.on(socketEvent.TYPING, () => setIsTyping(true));
        socket.on(socketEvent.STOP_TYPING, () => setIsTyping(false));

        return () => {
            socket.off(socketEvent.CONNECTED, () => {
                setSocketConnected(true);

            })
            socket.off(socketEvent.TYPING, () => setIsTyping(true));
            socket.off(socketEvent.STOP_TYPING, () => setIsTyping(false));

            socket.disconnect()
        }

    }, [])

    useEffect(() => {

        socket.emit(socketEvent.GET_USER_STATUS, user)
        socket.on(socketEvent.UPDATE_USER_STATUS, (data) => {
            if (selectedChat) {
                let sender = getSender(user, selectedChat.users)._id;
                if (data.includes(sender)) {
                    setUserisActive(true)
                } else setUserisActive(false)
            }

        })
    }, [selectedChat, user])

    useEffect(() => {
        setMessages([])

        fetchMessages()
        chatInputRef.current && chatInputRef.current.focus()

        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on(socketEvent.MESSAGE_RECIEVED, (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

                setChats(prevChats => {
                   
                    const updatedChats = prevChats.map(chat => {
                        if (chat._id === newMessageRecieved.chat._id) {
                            chat.latestMessage.content = newMessageRecieved.content;
                            chat.latestMessage.createdAt = newMessageRecieved.createdAt;
                        }
                        return chat;
                    });
                    
                    updatedChats.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt));
            
                    return updatedChats;
                });
            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
                
                setChats(prevChats => prevChats.map((chat) => {
                    if (chat._id === newMessageRecieved.chat._id) {

                        chat.latestMessage.content = newMessageRecieved.content
                        
                    }
                    return chat;
                }))
            }
        })

        socket.off(socketEvent.MESSAGE_RECIEVED, (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
        })


    }, [])


    const fetchMessages = async () => {
        if (!selectedChat)
            return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`${BaseConfig.BASE_API_URL}/message/${selectedChat._id}`, config)

            setMessages((prev) => [...data.data, ...prev]);
            setLoading(false);
            socket.emit(socketEvent.JOIN_CHAT, selectedChat._id);

        }
        catch (error) {

        }
    }

    const sendMessage = async (e) => {
        if (newMessage || image) {
            socket.emit(socketEvent.NEW_MESSAGE, {
                sender: {
                    _id: user._id,
                },
                content: newMessage,
                image: image,
                chat: {
                    _id: selectedChat._id,
                    users: selectedChat.users
                },
                createdAt: new Date()
            })

            setChats(prevChats => prevChats.map((chat) => {
                if (chat._id === selectedChat._id) {

                    chat.latestMessage.content = newMessage
                    chat.latestMessage.createdAt = new Date();
                }
                return chat;
            }))

            setMessages((prevMessages) => [...prevMessages, {
                sender: {
                    _id: user._id,
                },
                content: newMessage,
                image: image,
                chat: {
                    users: selectedChat.users
                }

            }]);

            try {
                const config = {
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage('');
                setImage(null)
                const { data } = await axios.post(`${BaseConfig.BASE_API_URL}/message`, {
                    content: newMessage,
                    image: image,
                    chatId: selectedChat._id
                }, config)

            }
            catch (error) {

            }
        }
    }


    const handleImageUpload = async (image) => {

        if (image.type === "Image/jpeg" || image.type === "Image/png" || image.type === "image/png") {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "chatly")
            data.append("cloud_name", "talhapro321")
            fetch("https://api.cloudinary.com/v1_1/talhapro321/image/upload", {
                method: "POST",
                body: data
            }).then((res) => res.json())
                .then(data => {

                    setImage(data.url.toString())

                })
                .catch((err) => {
                    console.log(err)

                })
        } else {

        }
    }

    const timeoutIdRef = useRef(null); // Declare a ref to hold the timeoutId

    const typingHandler = useCallback((e) => {
        setNewMessage(e.target.value)

        //if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit(socketEvent.TYPING, selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;

        console.log("timeoutIdRef.current: ", timeoutIdRef.current)

        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
            console.log()
            socket.emit(socketEvent.STOP_TYPING, selectedChat._id);
            setTyping(false);
        }, 1000);
    }, [typing]);

    return {
        selectedChat,
        setSelectedChat,
        getSender,
        messages,
        loading,
        chatInputRef,
        newMessage,
        image,
        typingHandler,
        sendMessage,
        handleImageUpload,
        istyping,
        isUserActive,

    }
}

export default useSingleChat