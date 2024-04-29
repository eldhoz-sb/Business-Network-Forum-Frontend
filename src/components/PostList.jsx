import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";
import postsService from "../services/post"; // Import the posts service

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postsService.getPosts();
      // Sort the posts by createdAt field in descending order
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };
  

  return (
    <Box margin={2}>
      {loading ? (
        <CircularProgress />
      ) : (
        <List sx={{display:'flex', flexDirection:"column", gap:"20px" }}>
          {posts.map((post) => (
            <Box key={post.id} border={"1px solid lightgray"} borderRadius={2} paddingLeft={1} paddingTop={2} paddingBottom={2} paddingRight={1} >
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={post.author.name} src={post.author.photo} />
                </ListItemAvatar>
                <ListItemText
                  primary={post.author.name}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {post.author.designation} at{" "}
                      {post.author.company}
                    </Typography>
                  }
                />
              </ListItem>
              <Box paddingLeft={2} paddingTop={1} paddingRight={2} paddingBottom={1}>
              <Typography>{post.title}</Typography>
              <Typography>{post.description}</Typography>
              </Box>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PostList;
