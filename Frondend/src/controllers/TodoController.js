// Todo Controller - Business Logic Layer
import React, { useState, useEffect } from 'react';
import TodoModel from '../models/TodoModel';
import UserModel from '../models/UserModel';
import TodoView from '../views/TodoView';

const TodoController = () => {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userId: '',
    completed: false
  });

  // Load todos and users on component mount
  useEffect(() => {
    loadTodos();
    loadUsers();
  }, []);

  // Load all todos
  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    const result = await TodoModel.getAllTodos();
    setLoading(false);

    if (result.success) {
      setTodos(result.data);
    } else {
      setError(result.error);
    }
  };

  // Load all users for dropdown
  const loadUsers = async () => {
    const result = await UserModel.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (editingTodo) {
      // Update todo
      const result = await TodoModel.updateTodo(editingTodo.id, formData);
      if (result.success) {
        await loadTodos();
        resetForm();
      } else {
        setError(result.error);
      }
    } else {
      // Create todo
      const result = await TodoModel.createTodo(formData);
      if (result.success) {
        await loadTodos();
        resetForm();
      } else {
        setError(result.error);
      }
    }
  };

  // Handle edit
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      userId: todo.userId.toString(),
      completed: todo.completed || false
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa todo này?')) {
      setError(null);
      const result = await TodoModel.deleteTodo(id);
      if (result.success) {
        await loadTodos();
      } else {
        setError(result.error);
      }
    }
  };

  // Handle toggle complete
  const handleToggleComplete = async (todo) => {
    setError(null);
    const result = await TodoModel.updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed
    });
    if (result.success) {
      await loadTodos();
    } else {
      setError(result.error);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingTodo(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      userId: '',
      completed: false
    });
    setEditingTodo(null);
  };

  return (
    <TodoView
      todos={todos}
      users={users}
      loading={loading}
      error={error}
      formData={formData}
      editingTodo={editingTodo}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleComplete={handleToggleComplete}
      onCancelEdit={handleCancelEdit}
    />
  );
};

export default TodoController;

