import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import useAuth from "../hooks/useAuth"; // Import the useAuth hook
import {
  Message,
  PersonAddRounded,
  Send,
  SendRounded,
} from "@mui/icons-material";

const MemberProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const { user } = useAuth(); // Use the useAuth hook to get the currently logged-in user
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/members/profiles`);
      const allProfiles = response.data;

      // Find the profile of the currently logged-in user
      const currentUserProfile = allProfiles.find(
        (profile) => profile.id === user.id
      );
      setUserProfile(currentUserProfile);
      console.log(currentUserProfile);

      // Filter out the profile of the currently logged-in user from all profiles
      const filteredProfiles = allProfiles.filter(
        (profile) => profile.id !== user.id
      );

      // Check connections between the logged-in user and other profiles
      const profilesWithConnectionStatus = filteredProfiles.map((profile) => {
        const connections = currentUserProfile.connections || []; // Ensure connections is an object
        const connection = connections.some(
          (connection) => connection.connectionId === profile.id
        );

        console.log(connection);

        return {
          ...profile,
        };
      });

      setProfiles(profilesWithConnectionStatus);
    } catch (error) {
      console.error("Error fetching member profiles:", error);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Wait for 3 seconds before setting loading to false

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchProfiles();
    }
  }, [fetchProfiles, loading]);

  const handleConnect = async (connectionId) => {
    try {
      // Send POST request to establish connection
      await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/members/connections/request`, {
        memberId: user.id,
        connectionId,
      });

      // Fetch updated profiles after connection
      await fetchProfiles();
    } catch (error) {
      console.error("Error connecting with member", error);
    }
  };

  const handleCancel = async (connectionId) => {
    try {
      // Send DELETE request to cancel connection
      await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/members/connections/cancel`, {
        data: {
          memberId: user.id,
          connectionId,
        },
      });

      // Fetch updated profiles after cancellation
      await fetchProfiles();
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
    <Grid container spacing={3}>
      {profiles.map((profile) => (
        <Grid item xs={12} sm={6} md={4} key={profile.id}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 300 }}
              image={profile.memberProfile.photo}
              title="profile-photo"
            />
            <CardContent>
              <Typography variant="h6" component="h2">
                {profile.memberProfile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Designation: {profile.memberProfile.designation}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Company: {profile.memberProfile.company}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Experience: {profile.memberProfile.experience} years
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Skills: {profile.memberProfile.skills}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Website: {profile.memberProfile.website}
              </Typography>
              {profile.connections &&
              profile.connections.some(
                (conn) => conn.connectionId === user.id
              ) ? (
                profile.connections.map((connection) => {
                  if (connection && connection.connectionId === user.id) {
                    // Logged-in user is connected to this profile
                    if (connection.accepted) {
                      // Connection is accepted, show message button
                      return (
                        <Button
                          key={connection.id}
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          startIcon={<SendRounded />}
                          fullWidth
                        >
                          Message
                        </Button>
                      );
                    } else if (connection.requestedId === user.id) {
                      // Connection request sent by logged-in user, show pending button
                      return (
                        <Box
                          key={connection.id}
                          display="flex"
                          gap={3}
                          
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            disabled
                          >
                            Pending
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 1, mr: 1 }}
                            onClick={() => handleCancel(profile.id)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      );
                    } else {
                      // Connection request received by logged-in user, show accept button
                      return (
                        <Box
                          key={connection.id}
                          display="flex"
                          gap={3}
                        
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
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
                            Cancel
                          </Button>
                        </Box>
                      );
                    }
                  } else {
                    // Logged-in user is not connected to this profile
                    return null;
                  }
                })
              ) : (
                <Button
                  onClick={() => handleConnect(profile.id)}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  startIcon={<PersonAddRounded />}
                >
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MemberProfileList;
