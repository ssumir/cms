import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    title: 'Web Development Basics',
    description: 'HTML, CSS, JavaScript fundamentals.',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop',
    link: '/courses/web-dev-intro',
  },
  {
    id: 2,
    title: 'React.js Essentials',
    description: 'Components, state, hooks.',
    image: 'https://images.unsplash.com/photo-1633356122544-ad5a2d9cd55b?q=80&w=2070&auto=format&fit=crop',
    link: '/courses/react-for-beginners',
  },
  {
    id: 3,
    title: 'Python for Data Science',
    description: 'Analysis, ML, visualization.',
    image: 'https://images.unsplash.com/photo-1555255707-cb3917833f2a?q=80&w=2070&auto=format&fit=crop',
    link: '/courses/data-science-python',
  },
  {
    id: 4,
    title: 'Advanced UX/UI Design',
    description: 'Prototyping, user testing.',
    image: 'https://images.unsplash.com/photo-1557682257-2f9c336b3506?q=80&w=2071&auto=format&fit=crop',
    link: '/courses/ux-ui-design',
  },
  {
    id: 5,
    title: 'Flutter Mobile Dev',
    description: 'Cross-platform app building.',
    image: 'https://images.unsplash.com/photo-1528698827521-62b478c90967?q=80&w=2070&auto=format&fit=crop',
    link: '/courses/flutter-dev',
  },
  {
    id: 6,
    title: 'Cloud Computing Intro',
    description: 'AWS, Azure, Google Cloud basics.',
    image: 'https://images.unsplash.com/photo-1593720219276-0b1e3facab8f?q=80&w=2070&auto=format&fit=crop',
    link: '/courses/cloud-computing',
  },
];

const AllCourses = ({ onClose }) => { // Accept onClose prop
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setCourses(mockCourses);
          setLoading(false);
        }, 800); // Shorter delay for modal content
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Box sx={{ py: 4, bgcolor: 'transparent', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: 'text.primary',
          }}
        >
          Explore All Courses
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Discover expert-led courses and gain the knowledge you need to succeed.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 3, justifyContent: 'center' }}>
            {courses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={3.5} lg={3}> {/* Adjusted Grid size for more cards per row */}
                <Card
                  sx={{
                    height: 320, // Slightly reduced height for compactness
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140" // Consistent image height
                    image={course.image}
                    alt={course.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 1.5 }}> {/* Reduced padding */}
                    <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 1.5, pb: 1.5 }}> {/* Reduced padding */}
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      fullWidth
                      component="a"
                      href={course.link}
                      sx={{
                        fontWeight: 'bold',
                        py: 0.8, // Reduced vertical padding
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      View Course
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      {/* Close button at the bottom of the modal content */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            py: 1,
            px: 4,
            borderRadius: '50px',
            fontWeight: 'bold',
          }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default AllCourses;