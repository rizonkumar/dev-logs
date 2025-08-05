const asyncHandler = require("../middleware/asyncHandler");
const noteService = require("../services/noteService");

const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getAllNotes(req.user.id);
  res.status(200).json(notes);
});

const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.user.id, req.params.id);
  res.status(200).json(note);
});

const createNote = asyncHandler(async (req, res) => {
  const newNote = await noteService.createNewNote(req.user.id, req.body);
  res.status(201).json(newNote);
});

const updateNote = asyncHandler(async (req, res) => {
  const updatedNote = await noteService.updateNoteById(
    req.user.id,
    req.params.id,
    req.body
  );
  res.status(200).json(updatedNote);
});

const deleteNote = asyncHandler(async (req, res) => {
  const result = await noteService.deleteNoteById(req.user.id, req.params.id);
  res.status(200).json(result);
});

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
