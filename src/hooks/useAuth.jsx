import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const baseUrl = `${import.meta.env.VITE_BACKEND_API_URL}`

  useEffect(() => {
    const storedAccessToken = window.localStorage.getItem('accessToken');
    const storedRefreshToken = window.localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      (async () => {
        try {
          const response = await axios.post(`${baseUrl}/api/login/verify-access-token`, null, {
            headers: {
              Authorization: `Bearer ${storedAccessToken}`,
            },
          });

          if (response.status === 200) {
            setIsLoggedIn(true);
            setUser(response.data);

            // Fetch user profile upon successful login
            await fetchUserProfile(storedAccessToken);
          } else {
            console.warn('Access token expired. Consider refreshing or redirecting.');
          }
        } catch (error) {
          console.error('Error verifying access token:', error);
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          setUser(null);
        }
      })();
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  };

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await axios.get(`${baseUrl}/api/members/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('user:', user);
  }, [isLoggedIn, user]);

  return { isLoggedIn, user, login, logout };
};

export default useAuth;
