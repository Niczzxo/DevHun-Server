if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  try {
    require("dotenv").config();
  } catch (err) {
    console.error("dotenv error", err);
  }
}

const express = require("express");
const cors = require("cors");
const { client } = require("./config/db.js");
const jobRouter = require("./routes/jobRouter.js");
const taskRouter = require("./routes/taskRouter.js");
const dashboardRouter = require("./routes/dashboardRouter.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://devhun-client.vercel.app"
  ],
  credentials: true
}));

// Add a global error handler for Express
app.use((err, req, res, next) => {
  console.error("Express App Error:", err);
  res.status(500).send({ success: false, message: "Internal server error", error: err.message });
});

// Routes
app.get("/", (req, res) => {
  res.send({ success: true, message: "DevHun server is running!" });
});

app.use("/jobs", jobRouter);
app.use("/added-tasks", taskRouter);
app.use("/dashboard", dashboardRouter);

app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "Route not found",
  });
});

// Conditionally listen if not in Vercel environment
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

// Export the app for Vercel Serverless Functions
module.exports = app;
