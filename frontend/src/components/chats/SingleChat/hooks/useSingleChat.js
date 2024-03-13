
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { io } from "socket.io-client";

import { ChatState } from '../../../../Context/chatProvider';
import { getSender } from '../../../../config/chatLogics';


const ENDPOINT = "http://localhost:4000/";
var socket, selectedChatCompare;

const useSingleChat = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [socketConnected, setSocketConnected] = useState(false)


    const chatInputRef = useRef(null)

    useEffect(() => {

        socket = io(ENDPOINT);
        socket.emit('setup', user)
        socket.on('connection', () => {
            setSocketConnected(true);
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        fetchMessages()
        chatInputRef.current && chatInputRef.current.focus()

        selectedChatCompare = selectedChat
    }, [selectedChat])



    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification
            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
        })

        socket.off('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification
            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
        })


    }, [])
    const toast = useToast()

    const fetchMessages = async () => {
        if (!selectedChat)
            return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`, config)
            console.log(messages)
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);

        }
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const sendMessage = async (e) => {
        if (newMessage) {
            socket.emit('new message', {
                sender: {
                    _id: user._id,
                },
                content: newMessage,
                chat: {
                    _id: selectedChat._id,
                    users: selectedChat.users
                }

            })

            setMessages((prevMessages) => [...prevMessages, {
                sender: {
                    _id: user._id,
                },
                content: newMessage,
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
                const { data } = await axios.post("http://localhost:4000/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

            }
            catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
    }
    return {
        selectedChat,
        setSelectedChat,
        getSender,
        messages,
        loading,
        chatInputRef,
        newMessage,
        typingHandler,
        sendMessage,

    }
}

export default useSingleChat