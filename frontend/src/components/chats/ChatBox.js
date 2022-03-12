import React from 'react'
import { ChatState } from '../../Context/chatProvider'

import {Box} from '@chakra-ui/react'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setfetchAgain}) => {
    const {selectedChat} = ChatState()
    return (
        <Box
            // d= {{base: selectedChat ? "flex" : "none", md: "flex"}}
            alignItems="center"
            p={3}
            bg="white"  
            w={{base: "100%", md: "68%"}}
            h="100%"
            borderRadius = "lg"
            borderWidth="1px"  
            
        >
            <SingleChat fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain} />
        </Box>
    )
}

export default ChatBox
