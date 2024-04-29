import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberProfileList from '../components/MemberProfileList';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook
import { Box, CircularProgress, Typography } from '@mui/material'; // Import Material-UI components

const MembersPage = () => {
  const { isLoggedIn, user } = useAuth(); // Use the useAuth hook
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (!isLoggedIn) {
        navigate('/login');
      }
    }, 1000); // Wait for 2 seconds before setting loading to false

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [isLoggedIn, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh', // Center content vertically
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box margin={4} alignItems={'center'}>
      <Typography variant="h2" mb={2}>Member Profiles</Typography>
      <MemberProfileList user={user} />
    </Box>
  );
};

export default MembersPage;
