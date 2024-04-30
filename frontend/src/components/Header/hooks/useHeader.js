import { useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../../Context/chatProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseConfig } from '../../../config/baseConfig';

const useHeader = () => {
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const [loadingChat, setLoadingChat] = useState()

    const {user, setSelectedChat, chats, setChats} = ChatState()
   
    const navigate = useNavigate()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSearch = async() => {
        if(!search) {
            toast({
              title: "search field is empty" ,
              status: "warning",
              isClosable: "true",
              duration: 1000,
              position: "top-right"
            });
            return;
        }

        try{
           setLoading(true)

           const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
           const { data } = await axios.get(`${BaseConfig.BASE_API_URL}/user?search=${search}`, config);

           setLoading(false)
           setSearchResult(data.data)
        }
        catch(error){
           
           toast({
               title: "Error Occured!",
               status: "warning",
               isClosable: "true",
               duration: 1000,
               position: "top-right"
           })
        }
    }

    const accessChat = async(userId) => {
        try {
            setLoadingChat(true);
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            
            const { data } = await axios.post(`${BaseConfig.BASE_API_URL}/chat`, { userId }, config);
            const customEvent = new CustomEvent('fetch_chat', {
              detail: { message: 'fetch all chat' }
            });
            window.dispatchEvent(customEvent);
            setSelectedChat(data.data);
            setLoadingChat(false);
            onClose();
           }
           catch(error){
            toast({
                title: "oops! something went wrong" ,
                status: "warning",
                isClosable: "true",
                duration: 1000,
                position: "top-right"
              });
           }
    }

    const LogoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
    }
  return {
    onOpen,
    onClose,
    isOpen,
    LogoutHandler,
    search,
    setSearch,
    handleSearch,
    loading,
    searchResult,
    accessChat
  }
}

export default useHeader