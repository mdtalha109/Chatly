import React from 'react'

import { IoSearch } from "react-icons/io5";
import { MdLogout } from "react-icons/md"

import UserListItem from '../chats/UserListItem';
import ChatLoading from '../chats/ChatLoading'

import { Button, Input, Modal} from '../ui'
import useHeader from './hooks/useHeader';


const Header = () => {

    const {
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
    } = useHeader()


  
    return (
        <div>
            <div className='flex justify-between items-center bg-[#2B3856] w-full p-5' >
                  <IoSearch className='text-white' onClick={onOpen}/> 
             
              <div className='text-white'>
                  <MdLogout className=''  onClick={LogoutHandler}/>   
              </div>
            </div>

            <Modal isOpen={isOpen} onClose={onClose} closeOverlay={true} width='md:w-[30vw] sm:90vw'>
                <Modal.Header>
                    Search user
                </Modal.Header>

                <Modal.Body>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-2 '>
                            <Input 
                              placeholder='username'
                              className=' flex-1'
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button
                              className='md:w-[10%] w-[20%]'
                              onClick={handleSearch}
                             
                            >
                              <IoSearch/>
                            </Button>
                        </div>

                        {
                          loading ? <ChatLoading/> : (
                            <>
                              {
                                searchResult?.map((user) => (
                                  <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                  />
                                ))
                              }
                            </>
                          )
                        }
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}


export default Header
