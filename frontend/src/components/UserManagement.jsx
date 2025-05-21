import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching users');
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/toggle`);
      setUsers(users.map(user => 
        user.id === id ? response.data : user
      ));
    } catch (err) {
      setError('Error toggling user status');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Error deleting user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button
                  className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'} mr-2`}
                  onClick={() => toggleActive(user.id)}
                  style={{ width: '100px' }}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  className="btn btn-sm btn-danger" 
                  style={{ width: '100px' }}
                  onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
