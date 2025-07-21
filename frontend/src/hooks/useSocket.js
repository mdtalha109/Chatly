import { useSocketContext } from '../Context/SocketProvider';

const useSocket = () => {
    return useSocketContext();
};

export default useSocket;