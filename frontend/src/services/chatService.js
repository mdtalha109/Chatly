import axios from "axios";
import { BaseConfig } from "../config/baseConfig";
import { apiClient, getAuthConfig } from "./api/apiClient";


export const chatService = {
  
  async createOrAccessChat(userId, token) {
    const { data } = await apiClient.post('/chat', { userId }, getAuthConfig(token));
    return data.data;

  },

  async fetchChats(token) {
    const { data } = await apiClient.get("/chat", getAuthConfig(token));
    return data.data;
  }
};