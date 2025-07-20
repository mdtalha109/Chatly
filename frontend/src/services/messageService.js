import axios from "axios";
import { apiClient } from "./api/apiClient";


export const messageService = {

    async fetchMessage(chatId) {
        try {
            const { data } = await apiClient.get(`/message/${chatId}`);
            return data.data;
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            throw error?.response?.data || new Error("Failed to load message");
        }
    },

    async sendMessage(chatId, content, image) {

        try {
            const { data } = await apiClient.post(`/message`,{ chatId, content, image });
            return data.data;
        } catch (error) {
            throw error?.response?.data || new Error("Failed to send message");
        }
    },
};