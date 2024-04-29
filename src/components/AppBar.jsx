import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/bizforum logo_small.png";
import { styled } from "@mui/system";
import useAuth from "../hooks/useAuth"; // Import the useAuth hook
import { Skeleton } from "@mui/material";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white", // Set the background color to transparent
  borderBottom: "1px solid rgba(0, 0, 0, 0.2)", // Add a bottom border with transparency
  boxShadow: "none", // Remove the box shadow
}));

const StyledToolbar = styled(Toolbar)({
  backdropFilter: "blur(10px)", // Add a backdrop filter for the smoking effect
});

const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "#212121", // Set the color to inherit from the parent
});

const loggedInPages = ["Home", "Members", "Network", "Reports"];
const loggedOutPages = ["Register", "Login"];
const settings = ["Profile", "Account"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth(); // Use the useAuth hook to get the authentication status and logout function

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingAvatar(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout(); // Call the logout function from useAuth
    navigate("/login"); // Redirect to homepage after logout
  };

  const pagesToShow = isLoggedIn ? loggedInPages : loggedOutPages;

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src={logo} // Update the path with your actual path
              alt={logo}
              style={{ maxHeight: "40px", marginRight: "8px" }} // Adjust the max height and margin as needed
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="#212121"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pagesToShow.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <StyledLink to={`/${page.toLowerCase()}`}>
                      {page}
                    </StyledLink>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src={logo} // Update the path with your actual path
              alt={logo}
              style={{ maxHeight: "40px", marginRight: "8px" }} // Adjust the max height and margin as needed
            />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pagesToShow.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <StyledLink to={`/${page.toLowerCase()}`}>{page}</StyledLink>
              </Button>
            ))}
          </Box>

          {isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {loadingAvatar ? (
                    <Avatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </Avatar>
                  ) : user.memberProfile &&
                    user.memberProfile.name &&
                    user.memberProfile.photo ? (
                    <Avatar
                      alt={user.memberProfile.name}
                      src={user.memberProfile.photo}
                    />
                  ) : (
                    <Avatar>Default</Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <Link
                        to={`/${setting.toLowerCase()}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {setting}
                      </Link>
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem key="logout" onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}

export default ResponsiveAppBar;
