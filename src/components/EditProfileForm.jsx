import { useState, useEffect } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

const EditProfileForm = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    experience: "",
    skills: "",
    website: "",
    photo: "", // Pre-populated with existing photo URL if available
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlPreview, setImageUrlPreview] = useState(null);

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_API_URL}/api/members/profile`, {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "accessToken"
            )}`,
          },
        });
        const profileData = response.data;
        setFormData(profileData.memberProfile); // Set form data with retrieved profile details
      } catch (error) {
        console.error(error);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (user.id) {
      // Fetch profile only if user ID is available
      setIsLoading(true);
      fetchProfile();
    }
  }, [user.id]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
  
    if (name === "photo" && files.length > 0) {
      const selectedFile = files[0];
      setImageFile(selectedFile);
  
      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrlPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFormData({ ...formData, [name]: value }); // Update form data with other field changes
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
        "/api/members/upload/photo",
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
      setImageFile(null); // Clear image selection after upload
      setImageUrlPreview(null); // Clear preview after upload
    } catch (error) {
      console.error(error);
      setError("Failed to upload profile photo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfileData = { ...formData }; // Copy form data for the request

      // Send PUT request with updated profile data as JSON
      const profileResponse = await axios.put(
        `/api/members/profile/`,
        updatedProfileData,
        {
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
            Authorization: `Bearer ${window.localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      console.log("Profile updated:", profileResponse.data);
      onProfileUpdate(); // Call callback function to exit form or update UI
    } catch (error) {
      console.error(error);
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      {/* Form fields for profile details */}
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
        <TextField
          fullWidth
          label="Designation"
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
          label="Experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
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
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" variant="contained">
            Update Profile
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

export default EditProfileForm;
