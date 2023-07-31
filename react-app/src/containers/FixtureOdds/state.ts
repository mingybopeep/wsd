import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api";
import { config } from "../../configVars";

// types
export type Odds = {
  timestamp: string;
  booky: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  Price: {
    priceName: {
      id: number;
      name: string;
    };
    value: number;
  }[];
};

export type State = {
  loading: boolean;
  error: boolean;
  hasMore: boolean;

  data: Odds[];
};

const initialState: State = {
  loading: false,
  error: false,
  hasMore: false,
  data: [],
};

// thunks
export type GetOddsParams = {
  offset: number;
  limit: number;
  fromDate: number;
  toDate: number;
  fixtureId: number;
};
export const getOdds = createAsyncThunk<Odds[], GetOddsParams>(
  "fixtures/getOdds",
  async ({ offset, limit, fromDate, toDate, fixtureId }) => {
    const url = new URL(config.apiUrl + "/fixture/" + fixtureId + "/odds");

    url.searchParams.set("offset", offset.toString());
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("fromDate", fromDate.toString());
    url.searchParams.set("toDate", toDate.toString());
    url.searchParams.set("type", "x");

    const { data } = await axios.get(url.href);

    return data;
  }
);

export const fixtureOddsSlice = createSlice({
  name: "fixtureOdds",
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
    builder.addCase(getOdds.pending, (state, action) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getOdds.fulfilled, (state, action) => {
      state.data = [...state.data, ...action.payload];
      state.loading = false;

      const limit = 50;
      state.hasMore = action.payload.length === limit;
    });
    builder.addCase(getOdds.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const { actions } = fixtureOddsSlice;

export default fixtureOddsSlice.reducer;
