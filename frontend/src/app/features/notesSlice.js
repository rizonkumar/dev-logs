import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import noteService from "../../services/noteService";

const initialState = {
  notes: [],
  activeNote: null,
  status: "idle",
  error: null,
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, thunkAPI) => {
    try {
      return await noteService.getNotes();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createNewNote = createAsyncThunk(
  "notes/createNote",
  async (noteData, thunkAPI) => {
    try {
      return await noteService.createNote(noteData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateExistingNote = createAsyncThunk(
  "notes/updateNote",
  async ({ noteId, updateData }, thunkAPI) => {
    try {
      return await noteService.updateNote(noteId, updateData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteExistingNote = createAsyncThunk(
  "notes/deleteNote",
  async (noteId, thunkAPI) => {
    try {
      await noteService.deleteNote(noteId);
      return noteId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setActiveNote: (state, action) => {
      state.activeNote = state.notes.find(
        (note) => note._id === action.payload
      );
    },
    clearActiveNote: (state) => {
      state.activeNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createNewNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.activeNote = action.payload;
      })
      .addCase(updateExistingNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex(
          (note) => note._id === action.payload._id
        );
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.activeNote?._id === action.payload._id) {
          state.activeNote = action.payload;
        }
      })
      .addCase(deleteExistingNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
        if (state.activeNote?._id === action.payload) {
          state.activeNote = null;
        }
      });
  },
});

export const { setActiveNote, clearActiveNote } = notesSlice.actions;
export default notesSlice.reducer;
