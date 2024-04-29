import { useState } from 'react';
import registerService from '../services/profile'; // Assuming registerService exists
import Notification from './Notification'
import { Box, Button, CircularProgress, TextField } from '@mui/material';

const MemberRegistrationForm = () => {
  // State variables for form data, visibility, and registration status
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [changeMessage, setChangeMessage] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // New state variable for registration process


  // Function to handle registration form submission
  const handleRegistration = async (event) => {
    event.preventDefault();
    setIsRegistering(true); // Set isRegistering to true when registration process starts


    try {
      const response = await registerService.registration({
        username,
        email,
        password,
      });

      if (response.status === 201) {
        setRegistrationSuccess(true);
        setChangeMessage(response.data.message);
        console.log('Registration Successful.', response);
        // Handle successful registration (e.g., display success message, redirect)
      } else {
        setErrorMessage(response.data.error);
        console.error('Registration Failed:', response);
        // Handle registration error (e.g., display error message to the user)
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      console.error('Registration failed:', error.response);
      // Handle registration error (e.g., display error message to the user)
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }finally {
      setIsRegistering(false); // Set isRegistering back to false after registration process completes
    }
  };

  return (
      <form onSubmit={handleRegistration} style={{ width:'100%' }} >
        <Notification message={changeMessage} error={errorMessage} />
        {isRegistering && ( // Show "Registering..." message when isRegistering is true
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Box ml={1}>Registering...</Box>
        </Box>
      )}
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={registrationSuccess}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={registrationSuccess}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={registrationSuccess}
        />
        <Button
          id="register-button"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={registrationSuccess}
        >
          Register
        </Button>
      </form>
  );
};

export default MemberRegistrationForm;
