require("dotenv").config();
const express = require("express");
const cors = require("cors");


const jobRouter = require("./routes/jobRouter.js");
const taskRouter = require("./routes/taskRouter.js");
const dashboardRouter = require("./routes/dashboardRouter.js");

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors({
  origin: [
    "https://devhun-client.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));


app.get("/", (req, res) => {
  res.send({ success: true, message: "DevHun server is running successfully!" });
});


app.use("/jobs", jobRouter);
app.use("/added-tasks", taskRouter);
app.use("/dashboard", dashboardRouter);


app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "Requested route not found",
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: "Something broke on the server!" });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running locally on port: ${port}`);
  });
}

module.exports = app;
