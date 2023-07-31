import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import store, { RootState } from "../../state";
import { authenticate } from "./state";

const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  const { username, loading } = useSelector(
    (state: RootState) => state.session
  );

  useEffect(() => {
    if (token && !username) {
      store.dispatch(authenticate());
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="h3" textAlign="center">
          Securing your account
        </Typography>
        <CircularProgress size={"100px"} />;
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};

export default SessionProvider;
