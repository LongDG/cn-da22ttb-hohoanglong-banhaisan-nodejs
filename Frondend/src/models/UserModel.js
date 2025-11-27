// User Model - API Service Layer
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class UserModel {
  // Get all users
  static async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return {
        success: true,
        data: response.data.data || response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Create new user
  static async createUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return {
        success: true,
        data: response.data.data || response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Update user
  static async updateUser(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      return {
        success: true,
        data: response.data.data || response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || error.message
      };
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      return {
        success: true,
        data: null,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.response?.data?.error || error.message
      };
    }
  }
}

export default UserModel;

