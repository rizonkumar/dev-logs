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
  skip: (req) => req.method === "OPTIONS",
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = isProduction
  ? [process.env.FRONTEND_URL, /\.vercel\.app$/]
  : ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((allowed) =>
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    );
    return isAllowed
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use("/api", limiter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Dev-Logs API!" });
});

app.use("/api/users", require("./api/routes/userRoutes"));
app.use("/api/logs", require("./api/routes/logRoutes"));
app.use("/api/todos", require("./api/routes/todoRoutes.js"));
app.use("/api/github", require("./api/routes/githubRoutes"));
app.use("/api/pomodoros", require("./api/routes/pomodoroRoutes"));
app.use("/api/reviews", require("./api/routes/reviewRoutes"));
app.use("/api/notes", require("./api/routes/noteRoutes"));

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
