require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { client } = require("./config/db.js");
const jobRouter = require("./routes/jobRouter.js");
const taskRouter = require("./routes/taskRouter.js");
const dashboardRouter = require("./routes/dashboardRouter.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const run = async () => {
  try {
    // await client.connect();

    app.get("/", (req, res) => {
      res.send({ success: true, message: "Labora server is running!" });
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
      // console.log("Server running in port: ", port);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);
