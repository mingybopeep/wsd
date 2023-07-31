import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api";
import { config } from "../../configVars";
import { State as HomepageState } from "../Homepage/state";

// types
export type State = {
  error: boolean;
  loading: boolean;
  username: string;
  userId: string;
  tempPath: string;
};

const initialState: State = {
  error: false,
  loading: false,
  username: "",
  userId: "",
  tempPath: "",
};

export const login = createAsyncThunk(
  "sessionProvider/login",
  async (payload: Pick<HomepageState, "username" | "password">) => {
    const { data } = await axios.post(`${config.apiUrl}/user`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return data;
  }
);

export const authenticate = createAsyncThunk<{
  username: string;
  userId: string;
  token: string;
}>(
  "sessionProvider/authenticate",
  async (): Promise<{
    username: string;
    userId: string;
    token: string;
  }> => {
    let url = new URL(`${config.apiUrl}/user/refresh`);

    const { data } = await axios.post(
      url.href,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return data;
  }
);

// slice
export const sessionProvider = createSlice({
  name: "sessionProvider",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setSession: (state, action: PayloadAction<State & { token: string }>) => {
      state.error = action.payload.error;
      state.loading = action.payload.loading;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.tempPath = action.payload.tempPath;
      localStorage.setItem("token", action.payload.token);
    },
    setTempPath: (state, action: PayloadAction<State["tempPath"]>) => {
      state.tempPath = action.payload;
    },
  },
  // reauthenticate
  extraReducers: (builder) => {
    builder.addCase(authenticate.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(authenticate.fulfilled, (state, action) => {
      state.loading = false;
      state.error = false;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(authenticate.rejected, (state, action) => {
      localStorage.removeItem("token");
      state.loading = false;
      state.error = true;
    });
    // login
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.loading = false;
      state.error = false;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { actions } = sessionProvider;

export default sessionProvider.reducer;
