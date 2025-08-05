const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api", limiter);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.FRONTEND_URL, /\.vercel\.app$/]
      : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Dev-Logs API!" });
});

app.use("/api/users", require("./api/routes/userRoutes"));
app.use("/api/logs", require("./api/routes/logRoutes"));
app.use("/api/todos", require("./api/routes/todoRoutes.js"));
app.use("/api/github", require("./api/routes/githubRoutes"));
app.use("/api/pomodoros", require("./api/routes/pomodoroRoutes"));
app.use("/api/reviews", require("./api/routes/reviewRoutes"));

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
