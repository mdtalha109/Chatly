import React from 'react';
import axios from 'axios';

import { renderHook } from "@testing-library/react-hooks/dom";
import { act } from 'react-dom/test-utils';
import { io } from "socket.io-client";
import '@testing-library/jest-dom';

import { ChatContext } from "../../../../../Context/chatProvider";
import { BaseConfig } from '../../../../../config/baseConfig';
import useSingleChat from "../../../../../components/chats/SingleChat/hooks/useSingleChat";

jest.mock('axios');
jest.mock('socket.io-client');

describe("useSingleChat", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches messages and emits join chat event upon component mounting", async () => {

    axios.get.mockResolvedValueOnce({
      data: { data: [{ id: 1, message: 'Test message' }] }
    });


    let user = {
      _id: 123,
      token: 'mock-token'
    }

    let selectedChat = {
      _id: '858787678576576576'
    }

    const socket = { emit: jest.fn(), on: jest.fn(), off: jest.fn() };
    io.mockReturnValue(socket);
   
    const { result } = renderHook(() => useSingleChat(), {
      wrapper: ({ children }) => (
        <ChatContext.Provider value={{user, selectedChat}}>{children}</ChatContext.Provider>
      ),
    });

    await act(async () => {
      expect(axios.get).toHaveBeenCalledWith(
        `${BaseConfig.BASE_API_URL}/message/${selectedChat._id}`,
        { headers: { Authorization: 'Bearer mock-token' } }
      );
    })

    await act(async () => {
      const { loading } = result.current;
      expect(loading).toBe(false);
    })

    //  first emit for creating socket connection and second one is for joining chat room
    expect(socket.emit).toHaveBeenCalledTimes(2);
  });
});