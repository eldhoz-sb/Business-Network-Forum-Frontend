import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Box, Typography, List, Container } from "@mui/material";
import ConnectionItem from "./ConnectionItem";
import useAuth from "../hooks/useAuth"; 

const MembersNetworkList = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Wait for 2 seconds before making the request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/api/members/connections/${user.id}`);
        const userConnections = response.data.connections;
        setConnections(userConnections);
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching user connections:", error);
      }
    };

    fetchConnections();
  }, [user]);

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
      <Typography variant="h5" gutterBottom>
        Connections
      </Typography>
      <List sx={{maxWidth:'600px'}}>
          <ConnectionItem connections={connections} />
      </List>
    </Container>
  );
};

export default MembersNetworkList;
