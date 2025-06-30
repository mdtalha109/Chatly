import React, { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../../../Context/chatProvider';
import { chatService } from '../../../../services/chatService';

const useChatList = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const fetchedChats = await chatService.fetchChats(user?.token);
      setChats(fetchedChats);
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

  }, [])


  return {
    chats,
    setSelectedChat,
    selectedChat,
    loggedUser
  }
}

export default useChatList