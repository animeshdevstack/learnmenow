import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Config from "../../../config/config";
import { saveAuthSession, getUserInfo } from "../../../helper/auth.helper";

const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showUnverifiedDialog, setShowUnverifiedDialog] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setShowSnackbar(true);
    }
  }, [location.state]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${Config.backendUrl}user/resend-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: unverifiedEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Verification email sent! Please check your inbox.");
        setShowSnackbar(true);
        setShowUnverifiedDialog(false);
      } else {
        setApiError(data.message || 'Failed to send verification email. Please try again.');
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setApiError('Network error. Please check your connection and try again.');
      setShowSnackbar(true);
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email or username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError("");
    
    try {
      const response = await fetch(`${Config.backendUrl}user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: formData.email,
          Password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.Token ?? data.token
        if (token) {
          saveAuthSession(token, data.User)
        }

        const userInfo = getUserInfo()
        console.log("Login Success:", userInfo);
        
        // Navigate to appropriate dashboard based on user role
        if (userInfo.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/competition');
        }
      } else {
        // Handle API errors
        const errorMessage = data.message || 'Login failed. Please try again.';
        
        // Check if it's an unverified account error
        if (errorMessage.includes('not verified') || errorMessage.includes('verify your email')) {
          setUnverifiedEmail(formData.email);
          setShowUnverifiedDialog(true);
        } else {
          setApiError(errorMessage);
          setShowSnackbar(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
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
                Sign in
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
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                  autoComplete="current-password"
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
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="remember" 
                      size="small"
                      sx={{
                        color: "rgba(148, 163, 184, 0.8)",
                        "&.Mui-checked": {
                          color: "#06b6d4",
                        },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{ 
                    alignSelf: "flex-start", 
                    mt: 0.5, 
                    fontSize: "0.8rem",
                    color: "white",
                    "& .MuiFormControlLabel-label": {
                      color: "white",
                    }
                  }}
                />
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
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                <Box sx={{ textAlign: "center", mb: 1 }}>
                  <Link 
                    component="button"
                    variant="body2" 
                    onClick={() => navigate('/user/forgot-password')}
                    sx={{ 
                      fontSize: "0.75rem",
                      color: "rgba(148, 163, 184, 0.8)",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#06b6d4",
                      }
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
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
                  onClick={() => window.location.href = `http://localhost:8080/oauth/google`}
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
                  Sign in with Google
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
                  Sign in with Facebook
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "rgba(148, 163, 184, 0.8)" }}>
                    Don't have an account?{" "}
                    <Link 
                      component="button"
                      variant="body2" 
                      onClick={() => navigate('/user/signup')}
                      sx={{ 
                        fontSize: "0.75rem",
                        color: "#06b6d4",
                        textDecoration: "none",
                        "&:hover": {
                          color: "#0891b2",
                        }
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
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
          <Typography sx={{ color: "white", fontSize: "1.5rem" }}>🧠</Typography>
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
              Welcome to LearnMeNow
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
              Your journey to success starts here. Join thousands of students
              preparing for competitive exams.
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
                  10K+
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Students
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
                  500+
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Success Stories
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
                  95%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Success Rate
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
                  Focus
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Prepare. Achieve.
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>
      
      {/* Unverified User Dialog */}
      <Dialog
        open={showUnverifiedDialog}
        onClose={() => setShowUnverifiedDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(71, 85, 105, 0.3)",
            borderRadius: 3,
            backdropFilter: "blur(10px)",
          }
        }}
      >
        <DialogTitle sx={{ color: "white", textAlign: "center", pb: 1 }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
            Account Not Verified
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" sx={{ color: "rgba(148, 163, 184, 0.8)", mb: 2 }}>
            Your account is not verified yet. Please check your email and click the verification link, or request a new verification email.
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(148, 163, 184, 0.6)", fontSize: "0.8rem" }}>
            Email: {unverifiedEmail}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1 }}>
          <Button
            onClick={() => setShowUnverifiedDialog(false)}
            variant="outlined"
            size="small"
            sx={{
              borderColor: "rgba(71, 85, 105, 0.5)",
              color: "rgba(148, 163, 184, 0.8)",
              fontSize: "0.8rem",
              "&:hover": {
                borderColor: "rgba(71, 85, 105, 0.8)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResendVerification}
            variant="contained"
            size="small"
            disabled={isResending}
            sx={{
              backgroundColor: "rgba(148, 163, 184, 0.9)",
              color: "#0f172a",
              fontSize: "0.8rem",
              "&:hover": {
                backgroundColor: "rgba(148, 163, 184, 1)",
              },
              "&:disabled": {
                backgroundColor: "rgba(148, 163, 184, 0.5)",
                color: "rgba(15, 23, 42, 0.5)",
              },
            }}
          >
            {isResending ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: "#0f172a" }} />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={successMessage ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {successMessage || apiError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserLogin;
