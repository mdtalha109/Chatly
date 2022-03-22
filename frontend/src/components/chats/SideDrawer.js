import React, { useState } from 'react'
import { Box } from "@chakra-ui/layout"
// import { BellIcon } from "@chakra-ui/icons"
import { Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, toast, useToast } from '@chakra-ui/react';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { ChatState } from '../../Context/chatProvider';
import { useNavigate } from 'react-router-dom';
import Search2Icon from '@chakra-ui/icon';
import axios from 'axios'
import './dot.css'
import UserListItem from './UserListItem';
import ChatLoading from './ChatLoading'




const SideDrawer = () => {
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
    
           const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

           setLoading(false)
           setSearchResult(data)
        }
        catch(error){
            console.log(error)
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
            
            const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);
           console.log(data)
            // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
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

  
    return (
        <div>
            <Box 
              d="flex"
              justifyContent="space-between"
              alignItems="center"
              bg="#2B3856"
              w="100%"
              p="20px 10px"
              // borderWidth="2px"
              // borderColor="black"
            >
              <Tooltip label="search user">
                  <Button onClick={onOpen}>
                      <i className='fas fa-search'></i>
                      <Text d={{base: '', md : 'flex'}} px='4'> search  </Text>
                  </Button>
              
              </Tooltip>

              <Text fontSize='1.2em' color='white'> Chatly </Text>

              <div>
                  <Menu>
                      {/* <MenuButton p="3" >
                          Notification
                      </MenuButton> */}
                      <MenuList>
                          {/* <MenuItem></MenuItem> */}
                      </MenuList>
                  </Menu>

                  <Button onClick={LogoutHandler}> Sign Out</Button>
              </div>
            </Box>

            

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
               <DrawerOverlay />
               <DrawerContent>
                  <DrawerHeader>Search User</DrawerHeader>
                  <DrawerBody>
                    <Box d="flex" pb={3}>
                        <input 
                            className='user-search-input' 
                            placeholder='username'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            
                            />
                        
                        <button 
                           onClick={handleSearch}
                           style={{backgroundColor:"#38B2AC", width:"20%"}}
                        >
                        Go</button>
                    </Box>

                    {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
                    
                  </DrawerBody>
               </DrawerContent>
               
            </Drawer>
        </div>
    )
}


export default SideDrawer
