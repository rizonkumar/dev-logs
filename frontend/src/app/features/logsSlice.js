import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import logService from "../../services/logService.js";

const initialState = {
  logs: [],
  status: "idle",
  error: null,
};

export const fetchLogs = createAsyncThunk(
  "logs/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await logService.fetchAllLogs();
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

export const createLog = createAsyncThunk(
  "logs/createLog",
  async (logData, { rejectWithValue }) => {
    try {
      return await logService.createLog(logData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createLog.pending, (state) => {})
      .addCase(createLog.fulfilled, (state, action) => {
        state.logs.unshift(action.payload);
      })
      .addCase(createLog.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default logsSlice.reducer;
