const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

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

app.use("/api/logs", require("./api/routes/logRoutes"));
app.use("/api/todos", require("./api/routes/todoRoutes.js"));
app.use("/api/github", require("./api/routes/githubRoutes"));

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
