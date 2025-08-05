import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import logsReducer from "./features/logsSlice";
import todosReducer from "./features/todosSlice";
import githubReducer from "./features/githubSlice";
import pomodoroReducer from "./features/pomodoroSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    logs: logsReducer,
    todos: todosReducer,
    github: githubReducer,
    pomodoro: pomodoroReducer,
  },
});
