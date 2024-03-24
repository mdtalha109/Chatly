
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { io } from "socket.io-client";

import { ChatState } from '../../../../Context/chatProvider';
import { getSender } from '../../../../config/chatLogics';
import { BaseConfig } from '../../../../config/baseConfig';


const ENDPOINT = BaseConfig.BASE_SERVER_URL
var socket, selectedChatCompare;

const useSingleChat = (fetchAgain, setfetchAgain) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [image, setImage] = useState(null)
    const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState()
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
                // setfetchAgain(!fetchAgain)
                setChats(prevChats =>  prevChats.map((chat) => {
                    console.log("chat._id: ", chat._id)
                    console.log("newMessageRecieved: ", newMessageRecieved)
                    if(chat._id === newMessageRecieved.chat._id){
                      
                        chat.latestMessage.content = newMessageRecieved.content
                    }
                    return chat;
                }))
            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
                // setfetchAgain(!fetchAgain)
                console.log("all chats list: ", chats)

                setChats(prevChats =>  prevChats.map((chat) => {
                    if(chat._id === newMessageRecieved.chat._id){
                      
                        chat.latestMessage.content = newMessageRecieved.content
                    }
                    return chat;
                }))
            }
        })

        socket.off('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification
                
            }
            else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);

                console.log("all chats list: ", chats)

                


              
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
            const { data } = await axios.get(`${BaseConfig.BASE_API_URL}/message/${selectedChat._id}`, config)

            setMessages(data.data);
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
                const { data } = await axios.post(`${BaseConfig.BASE_API_URL}/message`, {
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