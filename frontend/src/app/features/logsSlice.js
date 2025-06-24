import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [
    {
      date: "2025-06-23",
      entry:
        "Replaced the static Tech Stack component with a more dynamic and scalable Log Stats widget.",
    },
    {
      date: "2025-06-23",
      entry:
        "Enhanced the UI of the Log Detail Page and added functionality to add new logs directly from the page.",
    },
    {
      date: "2025-06-22",
      entry: "Refactored the homepage layout to be more modular.",
    },
    {
      date: "2025-06-21",
      entry:
        "Fixed the React Router bug caused by importing Link from the wrong package.",
    },
    {
      date: "2025-06-20",
      entry: "Planned new features for the homepage dashboard.",
    },
    { date: "2025-05-15", entry: "Fixed a bug related to styling on mobile." },
    { date: "2025-04-01", entry: "Initial project setup." },
  ],
};

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLog: (state, action) => {
      state.value.push(action.payload);
      state.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
});

export const { addLog } = logsSlice.actions;

export default logsSlice.reducer;
