import { Box, Skeleton, Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import ChatLoading from './ChatLoading';
import {  Stack, Text } from "@chakra-ui/layout";
import { getSender } from '../../config/chatLogics';

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get("http://localhost:5000/api/chat", config);
          setChats(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };

      useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        
      }, [fetchAgain])
      

    return (
        <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        px={3}
        pb={5}
        bg="#2B3856"
        w={{ base: "100%", md: "31%" }}
        
        // borderWidth="5px"
      >
        <Box
          
          // px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Text color="white"> bjn</Text> */}
         
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box 
                onClick={() => setSelectedChat(chat)}
                  px={5} 
                  py={2}
                  
                  key={chat._id}
                  bg={selectedChat === chat ? "#2B3856" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  cursor="pointer"
                  boxShadow="base"
                  
                
                >
                  <Text>
                  {chat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName
                  }
                  </Text>


                     {chat.latestMessage && (
                      <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                  
                </Box>
              ))}
            </Stack>
          ) : (
            <Stack>
          <Skeleton height="45px"/>
          <Skeleton height="45px"/>
          <Skeleton height="45px"/>
          <Skeleton height="45px"/>
          <Skeleton height="45px"/>
         
        </Stack>
          )}
        </Box>
      </Box>
    )
}

export default MyChats
