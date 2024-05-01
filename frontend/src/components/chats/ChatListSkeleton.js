import { Skeleton } from '@chakra-ui/react'
import React from 'react'

const ChatListSkeleton = () => {
  return (
    <div className='flex flex-col gap-2'>
    <Skeleton height="45px" />
    <Skeleton height="45px" />
    <Skeleton height="45px" />
    <Skeleton height="45px" />
    <Skeleton height="45px" />

  </div>
  )
}

export default ChatListSkeleton