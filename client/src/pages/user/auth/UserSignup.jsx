import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Container,
  Paper,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Config from "../../../config/config";

const UserSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "", 
    phone: "",
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError("");
    
    try {
      const response = await fetch(`${Config.backendUrl}user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FName: formData.firstName,
          LName: formData.lastName,
          Phone: formData.phone,
          Email: formData.email,
          Password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup Success:", data);
        // Navigate to login page with success message
        navigate('/user/login', { 
          state: { 
            message: 'Account created successfully! Please check your email to verify your account before signing in.' 
          } 
        });
      } else {
        // Handle API errors
        setApiError(data.message || 'Signup failed. Please try again.');
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setApiError('Network error. Please check your connection and try again.');
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
      {/* Left Side - Image/Illustration */}
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
        {/* Decorative Brain/Flower Icon */}
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
          <Typography sx={{ color: "white", fontSize: "1.5rem" }}>🎓</Typography>
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
              Join LearnMeNow
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
              Start your learning journey today. Create your account and access thousands of courses and resources.
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
                  Free
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Sign up
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
                  1000+
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Courses
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
                  24/7
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Support
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
                  Learn
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Grow. Succeed.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Right Side - Form */}
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
                Sign up
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                  mt: 2,
                }}
              >
                {/* Name Fields */}
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    margin="dense"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    size="small"
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
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    size="small"
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
                </Box>

                <TextField
                  margin="dense"
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  size="small"
                  placeholder="8009231232"
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
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  size="small"
                  placeholder="your@email.com"
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
                  name="password"
                  label="Password"
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
                  label="Confirm Password"
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
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      size="small"
                      sx={{
                        color: "rgba(148, 163, 184, 0.8)",
                        "&.Mui-checked": {
                          color: "#06b6d4",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: "white", fontSize: "0.8rem" }}>
                      I agree to the{" "}
                      <Link href="#" sx={{ color: "#06b6d4", fontSize: "0.8rem" }}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" sx={{ color: "#06b6d4", fontSize: "0.8rem" }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ 
                    alignSelf: "flex-start", 
                    mt: 0.5,
                    alignItems: "flex-start"
                  }}
                />
                {errors.terms && (
                  <Typography variant="body2" sx={{ color: "#ef4444", fontSize: "0.75rem", mt: 0.5 }}>
                    {errors.terms}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1.5,
                    mb: 0.5,
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
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
                <Divider sx={{ my: 1, "& .MuiDivider-root": { borderColor: "rgba(71, 85, 105, 0.5)" } }}>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "rgba(148, 163, 184, 0.8)" }}>
                    or
                  </Typography>
                </Divider>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  size="small"
                  onClick={() => window.location.href = `http://localhost:8080/oauth/google/signup`}
                  sx={{
                    mb: 0.5,
                    py: 0.6,
                    borderColor: "rgba(71, 85, 105, 0.5)",
                    color: "rgba(148, 163, 184, 0.8)",
                    fontSize: "0.75rem",
                    backgroundColor: "rgba(30, 41, 59, 0.3)",
                    "&:hover": {
                      borderColor: "rgba(71, 85, 105, 0.8)",
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                    },
                  }}
                >
                  Sign up with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Facebook />}
                  size="small"
                  sx={{
                    mb: 1.5,
                    py: 0.6,
                    borderColor: "rgba(71, 85, 105, 0.5)",
                    color: "rgba(148, 163, 184, 0.8)",
                    fontSize: "0.75rem",
                    backgroundColor: "rgba(30, 41, 59, 0.3)",
                    "&:hover": {
                      borderColor: "rgba(71, 85, 105, 0.8)",
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                    },
                  }}
                >
                  Sign up with Facebook
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "rgba(148, 163, 184, 0.8)" }}>
                    Already have an account?{" "}
                    <Link 
                      component="button"
                      variant="body2" 
                      onClick={() => navigate('/user/login')}
                      sx={{ 
                        fontSize: "0.75rem",
                        color: "#06b6d4",
                        textDecoration: "none",
                        "&:hover": {
                          color: "#0891b2",
                        }
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
      
      {/* Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {apiError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSignup;
