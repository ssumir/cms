import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import UserFormModal from './UserFormModal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch('https://apibeta.fellow.one/api/Users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError("Failed to fetch user data. Please check your network and authorization.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = (updatedUser) => {
    if (modalMode === 'create') {
      setUsers([...users, updatedUser]);
    } else if (modalMode === 'edit') {
      setUsers(users.map(user =>
        user.userId === updatedUser.userId ? updatedUser : user
      ));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://localhost:59244/api/Users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter(user => user.userId !== userId));
        console.log(`User with ID ${userId} deleted successfully.`);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here is a list of all users retrieved from the database.
        </Typography>
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={() => handleOpenModal('create')}>
            Add New User
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal('edit', user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteUser(user.userId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <UserFormModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        mode={modalMode}
        user={selectedUser}
        onFormSubmit={handleFormSubmit}
      />
    </Container>
  );
}