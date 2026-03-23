import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { saveAuthSession, getUserInfo } from "../../../helper/auth.helper";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const success = searchParams.get("success");
        const action = searchParams.get("action");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setIsLoading(false);
          return;
        }

        if (success === "true" && token) {
          saveAuthSession(token)

          const userInfo = getUserInfo()
          console.log("OAuth Success:", userInfo)

          const message = action === "signup" 
            ? "Account created successfully with Google!" 
            : "Signed in successfully with Google!"

          if (userInfo.role === "admin") {
            navigate("/admin/dashboard", { 
              state: { message } 
            });
          } else {
            navigate("/user/dashboard", { 
              state: { message } 
            });
          }
        } else {
          setError("OAuth authentication failed. Please try again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setError("An error occurred during authentication. Please try again.");
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, searchParams]);

  const handleRetry = () => {
    navigate("/user/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(71, 85, 105, 0.3)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress 
                  size={60} 
                  sx={{ 
                    color: "#06b6d4", 
                    mb: 2 
                  }} 
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Completing Authentication...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(148, 163, 184, 0.8)",
                    fontSize: "0.9rem",
                  }}
                >
                  Please wait while we set up your account.
                </Typography>
              </>
            ) : error ? (
              <>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    background: "rgba(239, 68, 68, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: "#ef4444", fontSize: "1.5rem" }}>
                    ⚠️
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Authentication Failed
                </Typography>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2, 
                    width: "100%",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    "& .MuiAlert-message": {
                      color: "white",
                    }
                  }}
                >
                  {error}
                </Alert>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(148, 163, 184, 0.8)",
                    fontSize: "0.9rem",
                    mb: 2,
                  }}
                >
                  Please try signing in again or contact support if the problem persists.
                </Typography>
                <button
                  onClick={handleRetry}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "rgba(148, 163, 184, 0.9)",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Try Again
                </button>
              </>
            ) : null}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default OAuthCallback;
