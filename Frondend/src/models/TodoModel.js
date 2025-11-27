// Todo Model - API Service Layer
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class TodoModel {
  // Get all todos
  static async getAllTodos(userId = null) {
    try {
      const url = userId 
        ? `${API_URL}/todos?userId=${userId}`
        : `${API_URL}/todos`;
      const response = await axios.get(url);
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

  // Get todo by ID
  static async getTodoById(id) {
    try {
      const response = await axios.get(`${API_URL}/todos/${id}`);
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

  // Create new todo
  static async createTodo(todoData) {
    try {
      const response = await axios.post(`${API_URL}/todos`, todoData);
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

  // Update todo
  static async updateTodo(id, todoData) {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, todoData);
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

  // Delete todo
  static async deleteTodo(id) {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
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

export default TodoModel;

