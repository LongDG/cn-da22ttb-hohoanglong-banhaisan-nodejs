// User Controller - Business Logic Layer
import React, { useState, useEffect } from 'react';
import UserModel from '../models/UserModel';
import UserView from '../views/UserView';

const UserController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load all users
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await UserModel.getAllUsers();
    setLoading(false);

    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error);
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

    if (editingUser) {
      // Update user
      const result = await UserModel.updateUser(editingUser.id, formData);
      if (result.success) {
        await loadUsers();
        resetForm();
      } else {
        setError(result.error);
      }
    } else {
      // Create user
      const result = await UserModel.createUser(formData);
      if (result.success) {
        await loadUsers();
        resetForm();
      } else {
        setError(result.error);
      }
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age || ''
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      setError(null);
      const result = await UserModel.deleteUser(id);
      if (result.success) {
        await loadUsers();
      } else {
        setError(result.error);
      }
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      age: ''
    });
    setEditingUser(null);
  };

  return (
    <UserView
      users={users}
      loading={loading}
      error={error}
      formData={formData}
      editingUser={editingUser}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancelEdit={handleCancelEdit}
    />
  );
};

export default UserController;

