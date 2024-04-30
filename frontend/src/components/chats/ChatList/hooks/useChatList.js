import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../../../Context/chatProvider';
import { getSender } from '../../../../config/chatLogics';
import { BaseConfig } from '../../../../config/baseConfig';

const useChatList = ({fetchAgain, setFetchAgain}) => {
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
    
          const { data } = await axios.get(`${BaseConfig.BASE_API_URL}/chat`, config);
          setChats(data.data);
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

        window.addEventListener('fetch_chat', fetchChats);
        return () => window.removeEventListener('fetch_chat', fetchChats);
    
      }, [fetchAgain])


    return {
        chats, 
        setSelectedChat,
        selectedChat,
        getSender,
        loggedUser
    }
}

export default useChatList