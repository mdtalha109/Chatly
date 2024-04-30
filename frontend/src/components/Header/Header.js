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

    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') {
          onClose();
      }
  };

    return (
        <header onKeyDown={handleKeyDown}>
            <div className='flex justify-between items-center bg-[#2B3856] w-full p-5' >
                  <search 
                      onClick={onOpen}
                      onKeyDown={(e) => { if (e.key === 'Enter') { onOpen(); } }}
                    >
                    <IoSearch className='text-white cursor-pointer'  tabindex={0} aria-label="Search" id='search_icon'/>
                  </search>
                   
             
              <div className='text-white cursor-pointer' tabindex={0} role="button" aria-label="Logout">
                  <MdLogout 
                    onClick={LogoutHandler}
                    onKeyDown={(e) => { if (e.key === 'Enter') { onOpen(); } }}
                  />   
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
                              autoFocus
                            />

                            <Button
                              className='md:w-[10%] w-[20%]'
                              onClick={handleSearch}
                              aria-label="Search Button"
                              tabindex={0}
                             
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

        </header>
    )
}


export default Header
