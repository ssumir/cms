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
import CategoryFormModal from './CategoryFormModal';

export default function CourseCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch('https://apibeta.fellow.one/api/CourseCategories', {
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
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError("Failed to fetch categories data. Please check your network and authorization.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = (updatedCategory) => {
    if (modalMode === 'create') {
      setCategories([...categories, updatedCategory]);
    } else if (modalMode === 'edit') {
      setCategories(categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://localhost:59244/api/CourseCategories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete category');
        }

        setCategories(categories.filter(cat => cat.id !== categoryId));
        console.log(`Category with ID ${categoryId} deleted successfully.`);
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('Failed to delete category. Please try again.');
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
          Course Categories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here is a list of all course categories.
        </Typography>
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={() => handleOpenModal('create')}>
            Add New Category
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="course categories table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Course Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.courseCount}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal('edit', category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteCategory(category.id)}
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
      <CategoryFormModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        mode={modalMode}
        category={selectedCategory}
        onFormSubmit={handleFormSubmit}
      />
    </Container>
  );
}