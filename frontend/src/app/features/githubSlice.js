import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import githubService from "../../services/githubService";

const initialState = {
  data: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchGithubData = createAsyncThunk(
  "github/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      return await githubService.fetchGithubContributions();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGithubData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGithubData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchGithubData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default githubSlice.reducer;
