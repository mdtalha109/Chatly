import { useState } from 'react';
import { toast } from '@chakra-ui/react';

import { userService } from '../../../../services/userService';
import { chatService } from '../../../../services/chatService';
import { ChatState } from '../../../../Context/chatProvider';


export const useUserSearch = ({ onChatCreated }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = ChatState();

  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast({
        title: "Search field is empty",
        status: "warning",
        isClosable: true,
        duration: 1000,
        position: "top-right"
      });
      return;
    }

    try {
      setIsLoading(true);
      const results = await userService.searchUsers(searchText, user.token);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Error occurred while searching!",
        status: "error",
        isClosable: true,
        duration: 1000,
        position: "top-right"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrAccessChat = async (userId) => {
    try {
      const chat = await chatService.createOrAccessChat(userId, user.token);
      
      const customEvent = new CustomEvent('fetch_chat', {
        detail: { message: 'fetch all chat' }
      });
      window.dispatchEvent(customEvent);
      
      onChatCreated?.(chat);
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        status: "error",
        isClosable: true,
        duration: 1000,
        position: "top-right"
      });
    }
  };

  const reset = () => {
    setSearchText('');
    setSearchResults([]);
    setIsLoading(false);
  };

  return {
    searchText,
    setSearchText,
    searchResults,
    isLoading,
    handleSearch,
    createOrAccessChat,
    reset
  };
};