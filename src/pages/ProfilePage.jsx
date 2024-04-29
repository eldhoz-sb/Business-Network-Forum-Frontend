import { useState, useEffect } from 'react';
import axios from 'axios'; 
import InitialProfileForm from '../components/InitialProfileForm';
import EditProfileForm from '../components/EditProfileForm';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Container, Paper, Typography } from '@mui/material';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = window.localStorage.getItem('accessToken');
  const navigate = useNavigate(); // Move useNavigate hook inside the component

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if token is not present
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/api/members/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include authorization header with token
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  if (isLoading) return <CircularProgress />;

  if (error) return <span>Error: {error}</span>;

  if (!user) return <span>User not found</span>;

  // Render profile information or completion message based on user data
  const { memberProfile } = user;

   // Check for incomplete profile and handle edit form visibility
   const isProfileComplete = memberProfile && Object.keys(memberProfile).length > 0;
   
   const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Container maxWidth="sm">
     <Paper sx={{ display:'flex', flexDirection:'column', alignItems:'flex-start', padding: 3, marginTop: 8, gap: 2 }}>
      <Typography variant="h4" sx={{ textAlign:'center', alignSelf:'center'}}>Profile</Typography>
      {!isEditing && isProfileComplete && (
        <ul>
          <img src={memberProfile.photo} alt='member-profile-photo' className='profile-photo' />
          <Typography variant="h6" component="h2">
                {memberProfile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Designation: {memberProfile.designation}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Company: {memberProfile.company}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Experience: {memberProfile.experience} years
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Skills: {memberProfile.skills}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Website: {memberProfile.website}
              </Typography>
        </ul>
      )}
      {!isEditing && !isProfileComplete && (
        <InitialProfileForm user={user} onProfileUpdate={() => setIsEditing(false)} /> // Initial form within ProfilePage
      )}
      {isEditing && (
        <EditProfileForm user={user} onProfileUpdate={() => setIsEditing(false)} /> // ProfileForm component with PUT method
      )}
      {!isEditing && isProfileComplete && (
        <Button variant="outlined" onClick={handleEditClick} sx={{alignSelf:'flex-end'}}>Edit Profile</Button>
      )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
