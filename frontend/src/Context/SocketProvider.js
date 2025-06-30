import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { BaseConfig } from '../config/baseConfig';
import { socketEvent } from '../constant/socket';
import { ChatState } from './chatProvider';

const ENDPOINT = BaseConfig.BASE_SERVER_URL;

const SocketContext = createContext();

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

let socket = null;

export const SocketProvider = ({ children }) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [userStatuses, setUserStatuses] = useState([]);
    const { user } = ChatState();
    const initialized = useRef(false);

    useEffect(() => {
        // Only initialize socket once
        if (!socket && user && !initialized.current) {
            initialized.current = true;
            
            socket = io(ENDPOINT);
            
            // Setup user connection
            socket.emit(socketEvent.SETUP, user);
            
            // Handle connection
            socket.on(socketEvent.CONNECTED, () => {
                console.log('Socket connected');
                setSocketConnected(true);
            });

            // Handle user status updates
            socket.emit(socketEvent.GET_USER_STATUS, user);
            socket.on(socketEvent.UPDATE_USER_STATUS, (data) => {
                console.log("got UPDATE_USER_STATUS");
                console.log("data: ", data);
                setUserStatuses(data);
            });

            // Handle socket errors
            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setSocketConnected(false);
            });

            socket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setSocketConnected(false);
            });
        }

        // Cleanup function
        return () => {
            if (socket && initialized.current) {
                console.log('Cleaning up socket connection');
                socket.off(socketEvent.CONNECTED);
                socket.off(socketEvent.UPDATE_USER_STATUS);
                socket.off('connect_error');
                socket.off('disconnect');
                socket.disconnect();
                socket = null;
                initialized.current = false;
                setSocketConnected(false);
                setUserStatuses([]);
            }
        };
    }, [user]);

    // Function to manually refresh user statuses
    const refreshUserStatuses = () => {
        if (socket && user) {
            socket.emit(socketEvent.GET_USER_STATUS, user);
        }
    };

    const value = {
        socket,
        socketConnected,
        userStatuses,
        refreshUserStatuses
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};