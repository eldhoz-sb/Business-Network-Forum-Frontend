import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Avatar, IconButton, Modal, TextField, Button, CircularProgress } from '@mui/material';
import { PostAdd as PostAddIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import postsService from '../services/post';
import useAuth from '../hooks/useAuth';
import PostList from '../components/PostList';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openModal, setOpenModal] = useState(false);
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


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await postsService.createPost(title, description);
      console.log('Post created successfully');
      setTitle('');
      setDescription('');
      handleCloseModal();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

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
    <Container maxWidth="sm">
      <Box display="flex" alignItems="center" mb={4} margin={2} padding={3} border={"1px solid lightgray"} borderRadius={2} >
        <Avatar alt={user?.memberProfile?.name} src={user?.memberProfile?.photo} sx={{ mr: 2 }} />
        <Button onClick={handleOpenModal} disableElevation fullWidth variant='outlined' size='large' sx={{ color:"#212121",borderColor:"#212121",borderRadius:"20px"}}>
          <PostAddIcon /> Post a requirement
        </Button>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant="h6" gutterBottom>Create a New Post</Typography>
            <CloseIcon onClick={handleCloseModal} />
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ alignSelf:'flex-end' }}>Post</Button>
          </form>
        </Box>
      </Modal>

      <PostList />
    </Container>
  );
};

export default HomePage;
