import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { Box, Container, Paper, Typography } from '@mui/material';

const LoginFormPage = ({ onLogin, isLoggedIn }) => {

  const navigate = useNavigate();
  console.log("User Logged In", isLoggedIn)
  if(isLoggedIn) {
    navigate('/profile');
    window.location.reload();
  }

  
  return (
    <Container maxWidth="sm">
      <Paper sx={{ display:'flex', flexDirection:'column', alignItems:'center', padding: 4, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <LoginForm onLogin={onLogin} />
        <Box mt={2}>
          <Typography variant="body1">
            Not Registered?{' '}
            <Link to="/register">
              Click Here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginFormPage;
