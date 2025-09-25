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

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const response = await fetch('https://apibeta.fellow.one/api/Enrollments', {
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
        setEnrollments(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
        setError("Failed to fetch enrollments data. Please check your network and authorization.");
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Placeholder functions for future actions
  const handleDeleteEnrollment = (enrollmentId) => {
    console.log(`Delete enrollment with ID: ${enrollmentId}`);
    // Future implementation will include an API call here
  };

  const handleCreateEnrollment = () => {
    console.log('Create a new enrollment');
    // Future implementation will open a modal here
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
          Enrollments
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Here is a list of all course enrollments.
        </Typography>
        <Box sx={{ mb: 2, textAlign: 'right' }}>
          <Button variant="contained" onClick={handleCreateEnrollment}>
            Add New Enrollment
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="enrollments table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Enrollment Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.id}</TableCell>
                  <TableCell>{enrollment.userFullName}</TableCell>
                  <TableCell>{enrollment.courseName}</TableCell>
                  <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{enrollment.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteEnrollment(enrollment.id)}
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
    </Container>
  );
}