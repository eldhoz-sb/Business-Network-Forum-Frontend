// LoginForm.js

import { useState } from "react";
import loginService from "../services/login";
import Notification from "./Notification";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("accessToken", user.accessToken);
      window.localStorage.setItem("refreshToken", user.refreshToken);
      console.log("Logged in Successfully", user);
      setUsername("");
      setPassword("");
      onLogin(); // Call the onLogin function passed from LoginPage.jsx to update authentication state
      navigate("/profile", { replace: true }); // Navigate to the profile page and replace the current history entry
      // Reload the components
      window.location.reload();
    } catch (exception) {
      if (exception.response.status === 500) {
        setErrorMessage("Server error");
      }
      if (exception.response.status === 401) {
        setErrorMessage(exception.response.data.error);
      }
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ width: "100%" }}>
      <Notification error={errorMessage} />
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button
        id="login-button"
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
