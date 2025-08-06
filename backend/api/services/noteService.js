const Note = require("../models/noteModel");

const getAllNotes = async (userId) => {
  return await Note.find({ user: userId }).sort({ updatedAt: -1 });
};

const getNoteById = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    const error = new Error("Note not found or user not authorized");
    error.statusCode = 404;
    throw error;
  }
  return note;
};

const createNewNote = async (userId, noteData) => {
  return await Note.create({ ...noteData, user: userId });
};

const updateNoteById = async (userId, noteId, updateData) => {
  console.log("Update Data", updateData);
  const note = await getNoteById(userId, noteId);
  Object.assign(note, updateData);
  await note.save();
  return note;
};

const deleteNoteById = async (userId, noteId) => {
  const note = await getNoteById(userId, noteId);
  await note.deleteOne();
  return { id: noteId, message: "Note removed successfully" };
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNewNote,
  updateNoteById,
  deleteNoteById,
};
