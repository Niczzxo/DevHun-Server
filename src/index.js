require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { client } = require("./config/db.js");
const jobRouter = require("./routes/jobRouter.js");
const taskRouter = require("./routes/taskRouter.js");
const dashboardRouter = require("./routes/dashboardRouter.js");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: ["https://dev-hun-client.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

const run = async () => {
  try {

    // await client.connect();

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


    app.listen(port, () => {
      console.log("Server running on port: ", port);
    });
  } catch (error) {
    console.error("Server Start Error: ", error);
  }
};

run().catch(console.dir);


module.exports = app;
