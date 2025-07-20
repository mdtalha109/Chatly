import { apiClient } from "./api/apiClient";

export const chatService = {
  async createOrAccessChat(userId) {
    try {
      const { data } = await apiClient.post('/chat', { userId });
      return data.data;
    } catch (error) {
      console.error("Failed to create or access chat:", error);
      throw error?.response?.data || new Error("Failed to create/access chat");
    }
  },

  async fetchChats() {
    try {
      const { data } = await apiClient.get("/chat");
      return data.data;
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      throw error?.response?.data || new Error("Failed to fetch chats");
    }
  }
};
