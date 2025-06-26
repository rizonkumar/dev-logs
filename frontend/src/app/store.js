import { configureStore } from "@reduxjs/toolkit";
import logsReducer from "./features/logsSlice";
import todosReducer from "./features/todosSlice";

export const store = configureStore({
  reducer: {
    logs: logsReducer,
    todos: todosReducer,
  },
});
