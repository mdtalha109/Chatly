
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
    const [image, setImage] = useState(null)
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
        if (newMessage || image) {
            socket.emit('new message', {
                sender: {
                    _id: user._id,
                },
                content: newMessage,
                image: image,
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
                const { data } = await axios.post("http://localhost:4000/api/message", {
                    content: newMessage,
                    image: image,
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


    const handleImageUpload = async(image) => {
        console.log("image: ", image)
        if(image.type  === "Image/jpeg" || image.type ==="Image/png" || image.type ==="image/png"){
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
                console.log("data.url.toString(): ", data.url.toString())
              })
              .catch((err) => {
                  console.log(err)
                  
              })
        } else{
            
            toast({
                title: 'oops!',
                description: "Media type not allowed",
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
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
        image,
        typingHandler,
        sendMessage,
        handleImageUpload

    }
}

export default useSingleChat