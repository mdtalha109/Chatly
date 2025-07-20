import axios from "axios";
import { BaseConfig } from "../config/baseConfig";

export const userService = {
  async searchUsers(searchTerm) {
    try {
      const { data } = await axios.get(`${BaseConfig.BASE_API_URL}/user?search=${searchTerm}`);
      return data.data;
    } catch (error) {
      console.error("Failed to search users:", error);
      throw error?.response?.data || new Error("Failed to search users");
    }
  }
};
