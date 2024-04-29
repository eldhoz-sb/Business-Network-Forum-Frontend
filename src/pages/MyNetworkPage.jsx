// MembersNetwork.jsx
import React, { useEffect, useState } from "react";
import MembersNetwork from "../components/MembersNetwork";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import useAuth from '../hooks/useAuth'; // Import the useAuth hook
import { useNavigate } from "react-router-dom";


const MyNetworkPage = () => {
  const { isLoggedIn } = useAuth(); // Use the useAuth hook
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
    <Container>
      <Typography variant="h2" mb={2}>Members Network</Typography>
      <MembersNetwork />
    </Container>
  );
};

export default MyNetworkPage;
