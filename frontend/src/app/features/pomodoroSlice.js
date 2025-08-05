import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pomodoroService from "../../services/pomodoroService";

let timerInterval = null;

const initialState = {
  workMinutes: 25,
  breakMinutes: 5,
  sessionType: "WORK",
  timeRemaining: 25 * 60,
  isRunning: false,
  sessionStartTime: null,
  currentTag: null,
  currentTitle: "",
  stats: { sessionsToday: 0 },
  history: [],
  status: "idle",
  historyStatus: "idle",
  error: null,
};

export const startTimerThunk = () => (dispatch, getState) => {
  clearInterval(timerInterval);

  dispatch(pomodoroSlice.actions.startTimer());

  timerInterval = setInterval(() => {
    const { timeRemaining, isRunning } = getState().pomodoro;
    if (timeRemaining > 0 && isRunning) {
      dispatch(pomodoroSlice.actions.tick());
    } else {
      dispatch(pauseTimerThunk());
      dispatch(logCompletedSession());
    }
  }, 1000);
};

export const pauseTimerThunk = () => (dispatch) => {
  clearInterval(timerInterval);
  dispatch(pomodoroSlice.actions.pauseTimer());
};

export const logCompletedSession = () => (dispatch, getState) => {
  const {
    sessionType,
    currentTitle,
    currentTag,
    workMinutes,
    breakMinutes,
    sessionStartTime,
  } = getState().pomodoro;

  dispatch(
    logSession({
      title:
        currentTitle ||
        (sessionType === "WORK" ? "Work Session" : "Break Session"),
      sessionType,
      tag: currentTag,
      duration: sessionType === "WORK" ? workMinutes : breakMinutes,
      startTime: sessionStartTime,
    })
  );

  const nextSession = sessionType === "WORK" ? "BREAK" : "WORK";
  dispatch(pomodoroSlice.actions.setSessionType(nextSession));
};

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

export const fetchHistory = createAsyncThunk(
  "pomodoro/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await pomodoroService.getPomodoroHistory();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const logSession = createAsyncThunk(
  "pomodoro/logSession",
  async (sessionData, { rejectWithValue }) => {
    try {
      return await pomodoroService.logPomodoroSession(sessionData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.toString());
    }
  }
);

const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
      if (!state.sessionStartTime) {
        state.sessionStartTime = new Date().toISOString();
      }
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    tick: (state) => {
      state.timeRemaining -= 1;
    },
    setSessionType: (state, action) => {
      state.isRunning = false;
      state.sessionType = action.payload;
      state.timeRemaining =
        action.payload === "WORK"
          ? state.workMinutes * 60
          : state.breakMinutes * 60;
      state.sessionStartTime = null;
      if (action.payload === "WORK") {
        state.currentTag = null;
      }
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeRemaining =
        state.sessionType === "WORK"
          ? state.workMinutes * 60
          : state.breakMinutes * 60;
      state.sessionStartTime = null;
    },
    setTag: (state, action) => {
      state.currentTag = action.payload;
    },
    setCurrentTitle: (state, action) => {
      state.currentTitle = action.payload;
    },
    setWorkMinutes: (state, action) => {
      const newWorkMinutes = parseInt(action.payload, 10);
      if (!isNaN(newWorkMinutes) && newWorkMinutes > 0) {
        state.workMinutes = newWorkMinutes;
        if (state.sessionType === "WORK" && !state.isRunning) {
          state.timeRemaining = newWorkMinutes * 60;
        }
      }
    },
    setBreakMinutes: (state, action) => {
      const newBreakMinutes = parseInt(action.payload, 10);
      if (!isNaN(newBreakMinutes) && newBreakMinutes > 0) {
        state.breakMinutes = newBreakMinutes;
        if (state.sessionType === "BREAK" && !state.isRunning) {
          state.timeRemaining = newBreakMinutes * 60;
        }
      }
    },
    setInitialTimes: (state, action) => {
      const { workMinutes, breakMinutes } = action.payload;
      if (workMinutes) state.workMinutes = workMinutes;
      if (breakMinutes) state.breakMinutes = breakMinutes;
      if (!state.isRunning) {
        state.timeRemaining = state.workMinutes * 60;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchHistory.pending, (state) => {
        state.historyStatus = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyStatus = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyStatus = "failed";
        state.error = action.payload;
      })
      .addCase(logSession.fulfilled, (state, action) => {
        state.stats.sessionsToday += 1;
        state.history.unshift(action.payload);
        state.currentTitle = "";
      });
  },
});

export const {
  startTimer,
  pauseTimer,
  tick,
  setSessionType,
  resetTimer,
  setTag,
  setWorkMinutes,
  setBreakMinutes,
  setCurrentTitle,
  setInitialTimes,
} = pomodoroSlice.actions;
export default pomodoroSlice.reducer;
