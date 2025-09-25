import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Mock data for categories and instructors
const mockCategories = [
  { id: 1, name: 'Programming' },
  { id: 2, name: 'Web Development' },
  { id: 3, name: 'Design' },
];

const mockInstructors = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Peter Jones' },
];

export default function CourseFormModal({ open, handleClose, mode, course, onFormSubmit, onDelete }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    categoryId: '',
    instructorId: '',
  });
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategories(mockCategories);
    setInstructors(mockInstructors);

    if (mode === 'edit' && course) {
      setFormData({
        name: course.name || '',
        description: course.description || '',
        price: course.price || '',
        discountPrice: course.discountPrice || '',
        categoryId: course.categoryId || '',
        instructorId: course.instructorId || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        instructorId: '',
      });
    }
  }, [mode, course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const courseData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        instructorId: parseInt(formData.instructorId, 10),
        categoryId: parseInt(formData.categoryId, 10),
      };

      let response;
      let updatedCourse;

      if (mode === 'create') {
        response = await fetch('https://apibeta.fellow.one/api/Courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(courseData),
        });
      } else if (mode === 'edit') {
        response = await fetch(`https://apibeta.fellow.one/api/Courses/${course.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...courseData, id: course.id }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${mode} course.`);
      }

      // Handle 204 (No Content) correctly
      if (response.status === 204) {
        updatedCourse = { ...course, ...courseData };
      } else {
        updatedCourse = await response.json();
      }

      onFormSubmit(updatedCourse);
      handleClose();
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!course?.id) return;
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const response = await fetch(`https://apibeta.fellow.one/api/Courses/${course.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete course.');
      }

      if (onDelete) onDelete(course.id);
      handleClose();
    } catch (err) {
      console.error('Delete Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" mb={2}>
          {mode === 'create' ? 'Add New Course' : 'Edit Course'}
        </Typography>
        {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: 10, right: 10 }} />}
        {error && <Typography color="error" mb={2}>{error}</Typography>}

        <TextField
          name="name"
          label="Course Name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            name="categoryId"
            value={formData.categoryId}
            label="Category"
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Instructor</InputLabel>
          <Select
            name="instructorId"
            value={formData.instructorId}
            label="Instructor"
            onChange={handleChange}
          >
            {instructors.map((ins) => (
              <MenuItem key={ins.id} value={ins.id}>{ins.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <TextField
          name="discountPrice"
          label="Discount Price"
          type="number"
          fullWidth
          margin="normal"
          value={formData.discountPrice}
          onChange={handleChange}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {mode === 'edit' && (
              <Button color="error" variant="contained" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button type="submit" variant="contained">
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
