import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
  Grid,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import Courses from "../Courses/Courses";
import CourseCategories from '../CourseCategories/CourseCategories';
import Enrollments from '../Enrollments/Enrollments';
import Users from '../Users/Users';
import NotFound from '../NotFound/NotFound';
import DashboardSummary from './DashboardSummary';
import ViewUserInformation from './ViewUserInformation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("summary");
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Failed to retrieve user from local storage:", error);
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  if (!user) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const drawerItems = [
    { text: "Dashboard Summary", mode: "summary", icon: <DashboardIcon sx={{ color: '#fff' }} /> },
    { text: "Course Categories", mode: "coursecategories", icon: <CategoryIcon sx={{ color: '#fff' }} /> },
    { text: "Courses", mode: "courses", icon: <SchoolIcon sx={{ color: '#fff' }} /> },
    { text: "Enrollments", mode: "enrollments", icon: <AssignmentTurnedInIcon sx={{ color: '#fff' }} /> },
    { text: "Users", mode: "users", icon: <GroupIcon sx={{ color: '#fff' }} /> },
    { text: "View User Information", mode: "user_info", icon: <PersonIcon sx={{ color: '#fff' }} /> },
  ];

  const handleDrawerClick = (mode) => () => {
    setViewMode(mode);
    setDrawerOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        bgcolor: "#673ab7",
        height: "100%",
        color: "#fff",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
      role="presentation"
    >
      <Box sx={{ p: 0, borderBottom: "1px solid", borderColor: "rgba(255, 255, 255, 0.2)" }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Welcome, {user.fullName}!
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Role: {user.role}
        </Typography>
      </Box>
      <List>
        {drawerItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={handleDrawerClick(item.mode)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (viewMode) {
      case "summary":
        return <DashboardSummary />;
      case "coursecategories":
        return <CourseCategories showNotification={showNotification} />;
      case "courses":
        return <Courses showNotification={showNotification} />;
      case "enrollments":
        return <Enrollments showNotification={showNotification} />;
      case "users":
        return <Users showNotification={showNotification} />;
      case "user_info":
        return <ViewUserInformation user={user} />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Box sx={{ bgcolor: '#5e35b1', margin:-2}}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(to right, #5e35b1, #5e35b1)',
          boxShadow: 3,
          borderRadius: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          top: '0px',
          padding: '0px 0px',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Course Management System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" component="span" sx={{ mr: 2, fontStyle: 'italic', color: '#fff' }}>
              Welcome, {user.fullName}!
            </Typography>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="inherit"
            >
              <PersonIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="temporary"
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          mt: 8
        }}
      >
        {renderContent()}
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}