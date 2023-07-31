import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// @ts-ignore

import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Alert,
} from "@mui/material";

import store, { RootState } from "../../state";
import { actions as sessionActions, login } from "../SessionProvider/state";
import { actions } from "./state";

export default function Homepage() {
  const dispatch = useDispatch();
  const { username, password, successCreds } = useSelector(
    (state: RootState) => state.homepage
  );

  const {
    loading,
    error,
    username: auth,
    tempPath,
  } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    dispatch(actions.resetState());

    return () => {
      dispatch(actions.resetState());
    };
  }, []);

  useEffect(() => {
    if (successCreds?.username) {
      dispatch(
        sessionActions.setSession({
          ...successCreds,
        })
      );
    }
  }, [successCreds?.username]);

  if (auth) {
    return <Navigate to={tempPath || "/fixtures"} />;
  }

  return (
    <Grid container>
      <>
        <Grid
          item
          xs={12}
          margin="auto"
          minHeight="100vh"
          sx={{
            textAlign: "center",
            background:
              "radial-gradient(circle, hsla(246, 42%, 18%, 1) 0%, hsla(249, 54%, 5%, 1) 100%)",
          }}
        >
          <Box
            sx={{
              height: 100,
            }}
          ></Box>
          <Box
            sx={{
              width: 350,
              margin: "auto",
            }}
          >
            <Box p={2}>
              <Typography variant="h3" fontWeight="bold">
                Sign in.
              </Typography>
            </Box>
            <Box p={2}>
              <TextField
                sx={{
                  "& input": {
                    color: "white",
                  },
                }}
                fullWidth
                label={"Username"}
                value={username}
                onChange={(e) =>
                  dispatch(
                    actions.changeFieldValue({
                      field: "username",
                      value: e.target.value,
                    })
                  )
                }
              />
            </Box>

            <Box p={2}>
              <TextField
                fullWidth
                sx={{
                  "& input": {
                    color: "white",
                  },
                }}
                label={"password"}
                type="password"
                value={password}
                onChange={(e) =>
                  dispatch(
                    actions.changeFieldValue({
                      field: "password",
                      value: e.target.value,
                    })
                  )
                }
              />
            </Box>

            <Box p={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{
                  width: "100%",
                }}
                variant="contained"
                onClick={() =>
                  store.dispatch(
                    login({
                      username,
                      password,
                    })
                  )
                }
              >
                Sign in
              </Button>
            </Box>

            {loading && <LinearProgress />}
            {error && (
              <Alert severity="error">
                Username/password combination not found
              </Alert>
            )}
          </Box>
        </Grid>
      </>
    </Grid>
  );
}
