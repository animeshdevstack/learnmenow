import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  ArrowBack,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Config from "../../../config/config";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({ 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("error");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${Config.backendUrl}user/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password has been reset successfully! You can now sign in with your new password.");
        setSnackbarType("success");
        setShowSnackbar(true);
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/user/login');
        }, 3000);
      } else {
        setApiError(data.message || 'Failed to reset password. Please try again.');
        setSnackbarType("error");
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setApiError('Network error. Please check your connection and try again.');
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 2,
          overflow: "auto",
        }}
      >
        <Container maxWidth="sm" sx={{ py: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Paper
              elevation={0}
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxHeight: "85vh",
                overflow: "auto",
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(71, 85, 105, 0.3)",
                borderRadius: 3,
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Logo Section */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
                    L
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  LearnMeNow
                </Typography>
              </Box>

              <Typography
                component="h1"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                }}
              >
                Reset Password
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(148, 163, 184, 0.8)",
                  mb: 3,
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                Enter your new password below. Make sure it's secure and easy to remember.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  size="small"
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ color: "rgba(148, 163, 184, 0.8)", mr: 1 }} />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "rgba(148, 163, 184, 0.8)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(71, 85, 105, 0.5)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(71, 85, 105, 0.8)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#06b6d4",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(148, 163, 184, 0.8)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#06b6d4",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "rgba(148, 163, 184, 0.7)",
                    },
                  }}
                />

                <TextField
                  margin="dense"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  size="small"
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ color: "rgba(148, 163, 184, 0.8)", mr: 1 }} />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "rgba(148, 163, 184, 0.8)" }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(71, 85, 105, 0.5)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(71, 85, 105, 0.8)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#06b6d4",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(148, 163, 184, 0.8)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#06b6d4",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "rgba(148, 163, 184, 0.7)",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 2,
                    mb: 1,
                    py: 0.8,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    backgroundColor: "rgba(148, 163, 184, 0.9)",
                    color: "#0f172a",
                    "&:hover": {
                      backgroundColor: "rgba(148, 163, 184, 1)",
                    },
                    "&:disabled": {
                      backgroundColor: "rgba(148, 163, 184, 0.5)",
                      color: "rgba(15, 23, 42, 0.5)",
                    },
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Link 
                    component="button"
                    variant="body2" 
                    onClick={() => navigate('/user/login')}
                    sx={{ 
                      fontSize: "0.8rem",
                      color: "#06b6d4",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      "&:hover": {
                        color: "#0891b2",
                      }
                    }}
                  >
                    <ArrowBack sx={{ fontSize: "1rem" }} />
                    Back to Sign In
                  </Link>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Right Side - Image/Illustration */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          position: "relative",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        {/* Decorative Icon */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            background: "linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.8,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <Typography sx={{ color: "white", fontSize: "1.5rem" }}>🔑</Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              p: 2,
              maxHeight: "100vh",
              overflow: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { md: "1.5rem", lg: "1.75rem" },
                color: "white",
              }}
            >
              Secure Password Reset
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                mb: 2,
                maxWidth: 350,
                mx: "auto",
                fontSize: "0.85rem",
                color: "rgba(148, 163, 184, 0.9)",
              }}
            >
              Create a strong, secure password to protect your account. Your security is our priority.
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.5,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: 1.5,
                  p: 1.5,
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, fontSize: "1.1rem", color: "#06b6d4" }}>
                  Secure
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Encryption
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: 1.5,
                  p: 1.5,
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, fontSize: "1.1rem", color: "#06b6d4" }}>
                  Protected
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Your Data
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: 1.5,
                  p: 1.5,
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, fontSize: "1.1rem", color: "#06b6d4" }}>
                  Safe
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Reset Process
                </Typography>
              </Box>
              <Box
                sx={{
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: 1.5,
                  p: 1.5,
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, fontSize: "1.1rem", color: "#06b6d4" }}>
                  Reliable
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  & Trusted
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarType === 'success' ? success : apiError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;
