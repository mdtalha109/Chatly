import React, { useState } from 'react'
import { Box } from "@chakra-ui/layout"
// import { BellIcon } from "@chakra-ui/icons"
import { Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, toast, useToast } from '@chakra-ui/react';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { ChatState } from '../../Context/chatProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './dot.css'
import UserListItem from './UserListItem';
import ChatLoading from './ChatLoading'




const SideDrawer = () => {
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
   

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

    const accessChat = (userId) => {

    }

    const LogoutHandler = () => {
        localStorage.removeItem('userInfo')
        navigate('/')
        
    }

    const {user} = ChatState()
    return (
        <div>
            <Box 
              d="flex"
              justifyContent="space-between"
              alignItems="center"
              bg="white"
              w="100%"
              p="5px 10px 5px 10px"
              borderWidth="2px"
              borderColor="black"
            >
              <Tooltip label="search user">
                  <Button onClick={onOpen}>
                      <i className='fas fa-search'></i>
                      <Text d={{base: 'none', md : 'flex'}} px='4'>Search User</Text>
                  </Button>
              
              </Tooltip>

              <Text>Chatly</Text>

              <div>
                  <Menu>
                      <MenuButton p="3" >
                          Notification
                      </MenuButton>
                      <MenuList>
                          {/* <MenuItem></MenuItem> */}
                      </MenuList>
                  </Menu>

                  <Menu>
                      <MenuButton p="3" >
                         
                           <Avatar name={user.email} src={user.pic}  size='sm' cursor="pointer" />
                         
                      </MenuButton>
                      <MenuList p="1px">
                          <MenuItem>Profile</MenuItem>
                          <MenuDivider/>
                          <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
                      </MenuList>
                  </Menu>
              </div>
            </Box>

            

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
               <DrawerOverlay />
               <DrawerContent>
                  <DrawerHeader>Create your account</DrawerHeader>
                  <DrawerBody>
                    <Box d="flex" pb={2}>
                        <input 
                            className='user-search-input' 
                            placeholder='username'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            />
                        
                        <button 
                           onClick={handleSearch}
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
