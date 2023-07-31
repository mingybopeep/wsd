import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api";
import { config } from "../../configVars";

// types
export type Fixture = {
  id: number;
  startTime: Date;
  countryName: string;
  competition: string;
  home: string;
  away: string;
};

export type State = {
  loading: boolean;
  error: boolean;

  data: Fixture[];
};

const initialState: State = {
  loading: false,
  error: false,
  data: [],
};

// thunks
export type GetFixturesParams = {
  offset: number;
  limit: number;
  fromDate: number;
  toDate: number;
  searchTerm: string;
};
export const getFixtures = createAsyncThunk<Fixture[], GetFixturesParams>(
  "fixtures/getFixtures",
  async ({ offset, limit, fromDate, toDate, searchTerm }) => {
    const url = new URL(config.apiUrl + "/fixture");

    url.searchParams.set("offset", offset.toString());
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("fromDate", fromDate.toString());
    url.searchParams.set("toDate", toDate.toString());
    url.searchParams.set("searchTerm", searchTerm);

    const { data } = await axios.get(url.href);
    return data;
  }
);

export const fixturesSlice = createSlice({
  name: "fixtures",
  initialState,
  reducers: {
    resetState: () => initialState,

    changeFieldValue: (
      state,
      action: PayloadAction<{ field: keyof State; value: any }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    // profile
    builder.addCase(getFixtures.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getFixtures.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(getFixtures.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { actions } = fixturesSlice;

export default fixturesSlice.reducer;
