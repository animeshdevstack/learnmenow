import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Email,
  ArrowBack,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Config from "../../../config/config";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setError("Invalid verification link");
      setIsLoading(false);
      setShowSnackbar(true);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${Config.backendUrl}user/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        setShowSnackbar(true);
      } else {
        setError(data.message || 'Email verification failed. Please try again.');
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError('Network error. Please check your connection and try again.');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = () => {
    navigate('/user/login', { 
      state: { 
        message: 'Please sign in to resend verification email.' 
      } 
    });
  };

  const handleGoToLogin = () => {
    navigate('/user/login');
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

              {isLoading ? (
                <>
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 2,
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    }}
                  >
                    Verifying Email...
                  </Typography>
                  
                  <CircularProgress 
                    sx={{ 
                      color: "#06b6d4", 
                      mb: 2,
                      width: 40,
                      height: 40
                    }} 
                  />
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(148, 163, 184, 0.8)",
                      textAlign: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    Please wait while we verify your email address.
                  </Typography>
                </>
              ) : isVerified ? (
                <>
                  <CheckCircle 
                    sx={{ 
                      fontSize: 60, 
                      color: "#10b981", 
                      mb: 2 
                    }} 
                  />
                  
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 1,
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    }}
                  >
                    Email Verified!
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
                    Your email has been successfully verified. You can now sign in to your account.
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={handleGoToLogin}
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
                    }}
                  >
                    Continue to Sign In
                  </Button>
                </>
              ) : (
                <>
                  <Error 
                    sx={{ 
                      fontSize: 60, 
                      color: "#ef4444", 
                      mb: 2 
                    }} 
                  />
                  
                  <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 1,
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                    }}
                  >
                    Verification Failed
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
                    {error || "We couldn't verify your email. The link may have expired or is invalid."}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={handleResendVerification}
                    sx={{
                      mt: 1,
                      mb: 1,
                      py: 0.8,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      backgroundColor: "rgba(148, 163, 184, 0.9)",
                      color: "#0f172a",
                      "&:hover": {
                        backgroundColor: "rgba(148, 163, 184, 1)",
                      },
                    }}
                  >
                    Resend Verification Email
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={handleGoToLogin}
                    sx={{
                      mb: 1,
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
                    Back to Sign In
                  </Button>
                </>
              )}
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
          <Typography sx={{ color: "white", fontSize: "1.5rem" }}>📧</Typography>
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
              Email Verification
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
              {isLoading 
                ? "We're verifying your email address. This will only take a moment."
                : isVerified 
                  ? "Your email has been successfully verified! Welcome to LearnMeNow."
                  : "Don't worry! You can request a new verification email if needed."
              }
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
                  Verification
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
                  Quick
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Process
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
                  & Safe
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
                  Easy
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: "0.7rem", color: "rgba(148, 163, 184, 0.9)" }}>
                  Setup
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
          severity={isVerified ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {isVerified 
            ? "Email verified successfully! You can now sign in." 
            : error || "Email verification failed. Please try again."
          }
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifyEmail;
