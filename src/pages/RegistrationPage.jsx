import { Link, useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { Box, Container, Paper, Typography } from '@mui/material';

const RegistrationPage = ({ isLoggedIn }) => {

  const navigate = useNavigate();
  console.log("User Logged In", isLoggedIn)
  if(isLoggedIn) {
    navigate('/profile');
  }

  
  return (
    <Container maxWidth="sm">
      <Paper sx={{ display:'flex', flexDirection:'column', alignItems:'center', padding: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Member Registration
        </Typography>
        <RegistrationForm />
        <Box mt={2}>
          <Typography variant="body1">
            Already a member?{' '}
            <Link to="/login">Login Here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationPage;
