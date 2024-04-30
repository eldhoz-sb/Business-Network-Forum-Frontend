// services/post.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/posts`; 


const getPosts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching posts');
  }
};

const createPost = async (title, description) => {
  try {
    const token = window.localStorage.getItem('accessToken');
    const response = await axios.post(API_URL, { title, description }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error creating post');
  }
};


export default {
  getPosts,
  createPost,
};
