import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ChatState } from '../../../../Context/chatProvider';
import { getSender } from '../../../../config/chatLogics';
import { BaseConfig } from '../../../../config/baseConfig';
import { socketEvent } from '../../../../constant/socket';
import useSocket from '../../../../hooks/useSocket';
import { messageService } from '../../../../services/messageService';

var socket, selectedChatCompare;

const useSingleChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [image, setImage] = useState(null);
    const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [isUserActive, setUserisActive] = useState(false);

    const chatInputRef = useRef(null);
    const timeoutIdRef = useRef(null);

    // Use the shared socket hook
    const { socket, socketConnected, userStatuses } = useSocket();

    // Handle typing events
    useEffect(() => {
        if (!socket) return;

        const handleTyping = () => setIsTyping(true);
        const handleStopTyping = () => setIsTyping(false);

        socket.on(socketEvent.TYPING, handleTyping);
        socket.on(socketEvent.STOP_TYPING, handleStopTyping);

        return () => {
            socket.off(socketEvent.TYPING, handleTyping);
            socket.off(socketEvent.STOP_TYPING, handleStopTyping);
        };
    }, [socket]);

    // Handle user status updates
    useEffect(() => {
        if (selectedChat && userStatuses.length > 0) {
            let sender = getSender(user, selectedChat.users)._id;
            setUserisActive(userStatuses.includes(sender));
        }
    }, [selectedChat, user, userStatuses]);

    // Handle chat selection
    useEffect(() => {
        setMessages([]);
        fetchMessages();
        chatInputRef.current && chatInputRef.current.focus();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // Handle incoming messages
    useEffect(() => {
        if(!socket) return
        socket.on(socketEvent.MESSAGE_RECIEVED, (newMessageRecieved) => {
            console.log("MESSAGE_RECIEVED: ")
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                setChats(prevChats => {
                    let chatUpdated = false;
                        const updatedChats = prevChats.map(chat => {
                            if (chat._id === newMessageRecieved.chat._id) {
                                chat.latestMessage.content = newMessageRecieved.content;
                                chat.latestMessage.createdAt = newMessageRecieved.createdAt;

                                chatUpdated = true;
                            }  
                            return chat;
                        });
                        
                        if(chatUpdated){
                            updatedChats.sort((a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt));
                            return updatedChats;
                        } else {
                            let chat = {};
                            chat._id= newMessageRecieved.chat._id
                            chat.users =  newMessageRecieved.chat.users;
                            chat.latestMessage = {     
                                content: newMessageRecieved.content,
                                sender: {
                                    name: newMessageRecieved.sender.name,
                                    email: newMessageRecieved.sender.email,
                                }
                            }
                            return [chat, ...prevChats]
                        } 
                });
            }
            else {
                
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
                
                setChats(prevChats => prevChats.map((chat) => {
                    if (chat._id === newMessageRecieved.chat._id) {

                        chat.latestMessage.content = newMessageRecieved.content
                        chat.latestMessage.createdAt = newMessageRecieved.createdAt;
                        
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


    }, [socket])

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const data  = await messageService.fetchMessage(selectedChat._id, user.token);

            setMessages((prev) => [...data, ...prev]);
            setLoading(false);
            
            if (socket) {
                socket.emit(socketEvent.JOIN_CHAT, selectedChat._id);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        if ((newMessage || image) && socket) {
            socket.emit(socketEvent.NEW_MESSAGE, {
                sender: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    pic: user.pic
                },
                content: newMessage,
                image: image,
                chat: {
                    _id: selectedChat._id,
                    users: selectedChat.users
                },
                createdAt: new Date()
            });

            setChats(prevChats => prevChats.map((chat) => {
                if (chat._id === selectedChat._id) {
                    if (!chat.latestMessage) {
                        chat.latestMessage = {};
                        chat.latestMessage.sender = {
                            name: user.name,
                            email: user.email
                        };
                    }
                    chat.latestMessage.content = newMessage;
                    chat.latestMessage.createdAt = new Date();
                }
                return chat;
            }));

            setMessages((prevMessages) => [...prevMessages, {
                sender: {
                    _id: user._id,
                },
                content: newMessage,
                image: image,
                chat: {
                    users: selectedChat.users
                },
                createdAt: new Date()
            }]);

            try {
                setNewMessage('');
                setImage(null);

                await messageService.sendMessage(selectedChat._id, newMessage, image, user.token);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleImageUpload = async (image) => {
        if (image.type === "Image/jpeg" || image.type === "Image/png" || image.type === "image/png") {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "chatly");
            data.append("cloud_name", "talhapro321");
            
            try {
                const response = await fetch("https://api.cloudinary.com/v1_1/talhapro321/image/upload", {
                    method: "POST",
                    body: data
                });
                const result = await response.json();
                setImage(result.url.toString());
            } catch (err) {
                console.error('Error uploading image:', err);
            }
        }
    };

    const typingHandler = useCallback((e) => {
        setNewMessage(e.target.value);

        if (!socket || !socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit(socketEvent.TYPING, selectedChat._id);
        }

        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = setTimeout(() => {
            socket.emit(socketEvent.STOP_TYPING, selectedChat._id);
            setTyping(false);
        }, 1000);
    }, [typing, socket, socketConnected, selectedChat]);

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
        socketConnected,
        userStatuses
    };
};

export default useSingleChat;
