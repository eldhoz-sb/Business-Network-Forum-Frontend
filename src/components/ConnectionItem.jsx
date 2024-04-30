import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  ListItemSecondaryAction,
  ListItemButton,
} from "@mui/material";
import useAuth from "../hooks/useAuth"; // Import the useAuth hook

const ConnectionItem = ({ connections }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        fetchProfiles();
      }
    }, 1000); // Wait for 2 seconds before fetching profiles

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [user]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/members/profiles`);
      const allProfiles = response.data;
      const connectionProfiles = allProfiles.filter((profile) =>
        connections.some((connection) => connection.connectionId === profile.id)
      );
      setProfiles(connectionProfiles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching member profiles:", error);
    }
  };

  const handleCancel = async (profileId) => {
    try {
      // Send DELETE request to cancel connection
      await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/members/connections/cancel`, {
        data: {
          memberId: user.id,
          connectionId: profileId,
        },
      });

      console.log("Connection Request Cancelled");
      // Reload the page after cancellation
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling connection", error);
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      // Send PUT request to accept connection
      await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/api/members/connections/accept`, {
        memberId: user.id,
        connectionId: connectionId,
      });
  
      console.log("Connection request accepted");
      // Reload the page after accepting the request
      window.location.reload();
    } catch (error) {
      console.error("Error accepting connection request", error);
    }
  };




  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh", // Center content vertically
        }}
      >
        <CircularProgress />
      </Box>
    );
  }



  return (
    <Box>
      <List>
      {profiles.map((profile, index) => {
  const connection = connections.find(connection => connection.connectionId === profile.id);
  return (
    <ListItem key={index}>
      <ListItemAvatar>
        <Avatar
          alt={profile.memberProfile.name}
          src={profile.memberProfile.photo}
        />
      </ListItemAvatar>
      <ListItemText
        primary={profile.memberProfile.name}
        secondary={
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
            >
              {profile.memberProfile.designation} at{" "}
              {profile.memberProfile.company}
            </Typography>    
        }
      />
      <ListItemSecondaryAction sx={{ justifyContent:'flex-end' }}>
      {connection && connection.requestedId !== user.id && !connection.accepted ? (
              <Box display={"flex"} gap={3} paddingTop={1}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={() => handleAcceptRequest(profile.id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1, mr: 1 }}
                  onClick={() => handleCancel(profile.id)}
                >
                  Delete
                </Button>
              </Box>
            ) : (
              <Box display={"flex"} gap={3} paddingTop={1}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!connection.accepted}
                >
                  {connection.accepted ? "Message" : "Pending"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleCancel(profile.id)}
                >
                  {connection.accepted ? "Delete" : "Cancel"}
                </Button>
              </Box>
            )}
            </ListItemSecondaryAction>
    </ListItem>
  );
})}

      </List>
      {profiles.length === 0 && (
        <Typography variant="body1">No connections found.</Typography>
      )}
    </Box>
  );
};

export default ConnectionItem;
