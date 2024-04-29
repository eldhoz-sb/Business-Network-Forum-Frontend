import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const InitialProfileForm = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    designation: "",
    company: "",
    experience: "",
    skills: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlPreview, setImageUrlPreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Handle photo upload separately
    if (name === "photo") {
      const file = event.target.files[0];
      setImageFile(file);

      // Generate a preview URL for the selected image (optional)
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImageUrlPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImageUrlPreview(null); // Clear preview if no file selected
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoUpload = async () => {
    if (!imageFile) {
      setError("Please select a profile photo");
      return; // Exit if no image is selected
    }

    try {
      // Upload image using FormData
      const formDataImage = new FormData();
      formDataImage.append("photo", imageFile);

      setIsLoading(true); // Show loading indicator for image upload

      const imageUploadResponse = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}/api/members/upload/photo`,
        formDataImage,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for image uploads
            Authorization: `Bearer ${window.localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      const uploadedPhotoUrl = imageUploadResponse.data.imageUrl; // Assuming response contains the image URL

      setFormData({ ...formData, photo: uploadedPhotoUrl }); // Update form data with uploaded photo URL

      console.log("Photo uploaded successfully", uploadedPhotoUrl);
      setIsLoading(false); // Hide loading indicator after upload success
    } catch (error) {
      console.error(error);
      setError("Failed to upload profile photo");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.photo) {
      setError("Please upload a profile photo before creating your profile");
      return; // Exit if no image uploaded
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare profile data with uploaded image URL
      const profileData = {
        name: formData.name,
        designation: formData.designation,
        company: formData.company,
        experience: formData.experience,
        skills: formData.skills,
        website: formData.website,
        photo: formData.photo, // Assuming 'photo' in formData contains the uploaded image URL
      };

      console.log("Sending Profile Data", profileData);
      // Send POST request with profile data as JSON
      const profileResponse = await axios.post(
        `${import.meta.env.VITE_LOCAL_API_URL}/api/members/profile`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
            Authorization: `Bearer ${window.localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      console.log("Profile created:", profileResponse.data);
      window.location.reload()
      onProfileUpdate(); // Call callback function to exit form
    } catch (error) {
      console.error(error);
      setError("Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for name, photo, and other profile details */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Name (required)"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <label htmlFor="photo">Profile Photo</label>
        <Box sx={{ display: "flex" }}>
          {/* Photo display and upload */}
          {formData.photo && (
            <div
              className="profile-photo"
              style={{ width: "150px", height: "150px" }}
            >
              <img
                src={formData.photo}
                alt="Profile Photo"
                className="profile-image-preview"
                style={{
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
          <div
            className="upload-options"
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <div className="change-photo">
              <input
                type="file"
                name="photo"
                id="photo"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <label htmlFor="photo">
                <IconButton component="span">
                  <CloudUploadIcon />
                  <Typography variant="body2">Choose Photo </Typography>
                </IconButton>
              </label>
              {imageUrlPreview && (
                <div>
                  <img
                    src={imageUrlPreview}
                    alt="Selected profile image preview"
                    className="profile-image-preview"
                    style={{
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </div>
            <Button onClick={handlePhotoUpload} variant="contained">
              Upload Photo
            </Button>
          </div>
        </Box>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Designation (optional)"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Company (required)"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Experience (optional)"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Skills (optional)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Website (optional)"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" variant="contained">
            Create Profile
          </Button>
        )}
      </Box>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </form>
  );
};

export default InitialProfileForm;
