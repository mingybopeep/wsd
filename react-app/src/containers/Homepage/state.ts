import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { State as SessionState } from "../SessionProvider/state";

// types
export type State = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  registerLoading: boolean;
  registerError: boolean;
  successCreds: null | (SessionState & { token: string });
};

const initialState: State = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  registerLoading: false,
  registerError: false,
  successCreds: null,
};

// slice
export const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    resetState: () => initialState,

    changeFieldValue: (
      state,
      action: PayloadAction<{ field: keyof State; value: any }>
    ) => {
      // @ts-ignore
      state[action.payload.field] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions } = homepageSlice;

export default homepageSlice.reducer;
