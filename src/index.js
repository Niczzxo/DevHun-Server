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
  const htmlResponse = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DevHun API Server</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #0f172a;
              color: #e2e8f0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
          }
          .container {
              text-align: center;
              background: #1e293b;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              max-width: 500px;
              width: 90%;
              border: 1px solid #334155;
          }
          h1 {
              margin-top: 0;
              color: #38bdf8;
              font-size: 2.5rem;
              letter-spacing: -0.025em;
          }
          .status {
              display: inline-flex;
              align-items: center;
              background: rgba(16, 185, 129, 0.1);
              color: #34d399;
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              font-weight: 600;
              font-size: 0.875rem;
              margin-bottom: 1.5rem;
              border: 1px solid rgba(16, 185, 129, 0.2);
          }
          .status-dot {
              width: 8px;
              height: 8px;
              background-color: #34d399;
              border-radius: 50%;
              margin-right: 8px;
              box-shadow: 0 0 8px #34d399;
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
          }
          p {
              color: #94a3b8;
              line-height: 1.6;
              margin-bottom: 2rem;
          }
          .links {
              margin-top: 2rem;
              padding-top: 2rem;
              border-top: 1px solid #334155;
          }
          a {
              display: inline-block;
              background-color: #0ea5e9;
              color: white;
              text-decoration: none;
              font-weight: 600;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              transition: background-color 0.2s, transform 0.1s;
          }
          a:hover {
              background-color: #0284c7;
          }
          a:active {
              transform: scale(0.98);
          }
          .version {
              margin-top: 1.5rem;
              font-size: 0.75rem;
              color: #475569;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="status">
              <div class="status-dot"></div>
              System Online
          </div>
          <h1>DevHun API</h1>
          <p>Welcome to the DevHun Server. The backend infrastructure is functioning properly and ready to accept requests.</p>

          <div class="links">
              <a href="https://devhun-client.vercel.app" target="_blank">Visit Client Application</a>
          </div>
          <div class="version">Secure REST API &bull; Node.js Backend</div>
      </div>
  </body>
  </html>
  `;
  res.send(htmlResponse);
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
