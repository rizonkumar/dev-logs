import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pomodoroService from "../../services/pomodoroService";

const initialState = {
  workMinutes: 25,
  breakMinutes: 5,

  sessionType: "WORK",
  timeRemaining: 25 * 60,
  isRunning: false,

  stats: { sessionsToday: 0 },
  status: "idle",
  error: null,
};

export const logSession = createAsyncThunk(
  "pomodoro/logSession",
  async (sessionData, { rejectWithValue }) => {
    try {
      return await pomodoroService.logPomodoroSession(sessionData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchStats = createAsyncThunk(
  "pomodoro/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await pomodoroService.fetchPomodoroStats();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    tick: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.isRunning = false;
      }
    },
    setSessionType: (state, action) => {
      state.isRunning = false;
      state.sessionType = action.payload;
      state.timeRemaining =
        action.payload === "WORK"
          ? state.workMinutes * 60
          : state.breakMinutes * 60;
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeRemaining =
        state.sessionType === "WORK"
          ? state.workMinutes * 60
          : state.breakMinutes * 60;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(logSession.fulfilled, (state, action) => {
        state.stats.sessionsToday += 1;
      });
  },
});

export const { startTimer, pauseTimer, tick, setSessionType, resetTimer } =
  pomodoroSlice.actions;

export default pomodoroSlice.reducer;
