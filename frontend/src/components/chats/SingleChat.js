
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import { getSender } from '../../config/chatLogics';
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import axios from 'axios';
import './styles/messageStyle.css'
import ScrollableChat from './ScrollableChat';
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000/";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const {user, selectedChat, setSelectedChat} = ChatState()
    const [socketConnected, setSocketConnected] = useState(false)

    useEffect(() => {
        

        socket = io(ENDPOINT);
        socket.emit('setup', user)
        socket.on('connection', ()=> {
            setSocketConnected(true);
        })
    }, [])

    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat
    }, [selectedChat])

    

    useEffect(()=> {
        socket.on('message recieved', (newMessageRecieved) =>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                //give notification
            }
            else{
                setMessages([...messages, newMessageRecieved]);
            }
        } )
    })

    

    

    const toast = useToast()

    const fetchMessages = async() => {
        if(!selectedChat)
            return;
        
        try{
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const {data} = await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`, config)
            console.log(messages)
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
            
        }
        catch(error) {
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

    

    const sendMessage = async(e) => {
        if(newMessage){
            try{    
                const config = {
                    headers: {
                        "content-Type" :  "application/json",
                        Authorization : `Bearer ${user.token}`
                    }
                }
                setNewMessage('');
                const {data} = await axios.post("http://localhost:5000/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                console.log(data)
                socket.emit('new message', data)
                setMessages([...messages, data])
            }
            catch(error){
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

        // Typing Indicator
    }


    return (
        <>
            {   selectedChat ? (
                <>
                      <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                      >
                         <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                         />
                          {getSender(user, selectedChat.users)}

                      </Text>
                      <Box
                         d="flex"
                         flexDir="column"
                         justifyContent="flex-end"
                         p={3}
                         bg="#E8E8E8"
                         w="100%"
                         h="90%"
                         borderRadius="lg"
                         overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                              ):(
                                
                                    <ScrollableChat messages={messages}/>
                                
                              )
                            }
                            <FormControl  isRequiredmt={3}>
                                <div style={{display:"flex", marginTop:"10px"}}>
                                    <Input
                                        variant="filled"
                                        bg="#E0E0E0"
                                        borderColor="black"
                                        placeholder='Enter a message...'
                                        onChange={typingHandler}
                                        value={newMessage}
                                        
                                    />

                                    <Button style={{width:"10%", backgroundColor:"#2B3856", marginLeft:"10px"}} onClick={sendMessage}> <ArrowForwardIcon/> </Button>

                                    
                                </div>

                                
                                
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box d = "flex" alignItems="center" justifyContent="center" h= "100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat
