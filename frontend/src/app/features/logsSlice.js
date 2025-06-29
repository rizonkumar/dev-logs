import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import logService from "../../services/logService.js";

const initialState = {
  logs: [],
  stats: null,
  status: "idle",
  statsStatus: "idle",
  error: null,
  statsError: null,
};

export const fetchLogs = createAsyncThunk(
  "logs/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      return await logService.fetchAllLogs();
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

export const deleteLog = createAsyncThunk(
  "logs/deleteLog",
  async (logId, { rejectWithValue }) => {
    try {
      return await logService.deleteLog(logId);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const updateLog = createAsyncThunk(
  "logs/updateLog",
  async ({ logId, updateData }, { rejectWithValue }) => {
    try {
      return await logService.updateLog(logId, updateData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchLogStats = createAsyncThunk(
  "logs/fetchLogStats",
  async (_, { rejectWithValue }) => {
    try {
      return await logService.fetchLogStats();
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
      .addCase(createLog.fulfilled, (state, action) => {
        state.logs.unshift(action.payload);
      })
      .addCase(deleteLog.fulfilled, (state, action) => {
        state.logs = state.logs.filter((log) => log._id !== action.payload.id);
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        const index = state.logs.findIndex(
          (log) => log._id === action.payload._id
        );
        if (index !== -1) {
          state.logs[index] = action.payload;
        }
      })
      .addCase(fetchLogStats.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchLogStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchLogStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload;
      });
  },
});

export default logsSlice.reducer;
