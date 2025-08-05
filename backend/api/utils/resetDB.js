const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path"); // Import the 'path' module
const connectDB = require("../../config/db");

const User = require("../models/userModel");
const Log = require("../models/logModel");
const Todo = require("../models/todoModel");
const Review = require("../models/reviewModel");
const Pomodoro = require("../models/pomodoroModel");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

connectDB();

const clearData = async () => {
  try {
    console.log("--- Clearing Data ---");
    await User.deleteMany();
    await Log.deleteMany();
    await Todo.deleteMany();
    await Review.deleteMany();
    await Pomodoro.deleteMany();
    console.log("Data successfully destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

clearData();
