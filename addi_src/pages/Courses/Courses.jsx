import React, { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, AddCircleOutline } from '@mui/icons-material';
import CourseFormModal from './CourseFormModal';

export default function Courses({ showNotification, onDataFetched }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch('https://apibeta.fellow.one/api/Courses', {
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
      setCourses(data);

      if (onDataFetched) {
        onDataFetched({
          totalCourses: data.length,
          publishedCourses: data.filter(c => c.isPublished).length,
          draftCourses: data.filter(c => !c.isPublished).length,
        });
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to fetch courses data.');
      showNotification('Failed to fetch courses data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (mode, course = null) => {
    setModalMode(mode);
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  // This function correctly handles both create and edit submissions.
  // It receives the new or updated course object from the modal.
  const handleFormSubmit = (submittedCourse) => {
    if (modalMode === 'create') {
      setCourses(prevCourses => [...prevCourses, submittedCourse]);
      showNotification('Course created successfully!', 'success');
    } else if (modalMode === 'edit') {
      setCourses(prevCourses => prevCourses.map(course =>
        course.id === submittedCourse.id ? submittedCourse : course
      ));
      showNotification('Course updated successfully!', 'success');
    }
    handleCloseModal();
  };

  // This function handles the delete logic directly.
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://apibeta.fellow.one/api/Courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete course. Status: ${response.status}`);
      }

      // Update the state to reflect the deletion
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      showNotification('Course deleted successfully!', 'success');

      if (onDataFetched) {
        onDataFetched({
          totalCourses: updatedCourses.length,
          publishedCourses: updatedCourses.filter(c => c.isPublished).length,
          draftCourses: updatedCourses.filter(c => !c.isPublished).length,
        });
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      showNotification('Failed to delete course. Please try again.', 'error');
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
          Courses
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here is a list of all courses.
        </Typography>
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={() => handleOpenModal('create')}
            startIcon={<AddCircleOutline />}
          >
            Add New Course
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="courses table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.categoryId}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Course">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal('edit', course)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Course">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <CourseFormModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        mode={modalMode}
        course={selectedCourse}
        onFormSubmit={handleFormSubmit}
      />
    </Container>
  );
}