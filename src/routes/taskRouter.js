const express = require("express");
const validateTokenId = require("../middlewares/validateTokenId.js");
const verifyTokenId = require("../middlewares/verifyTokenId.js");
const {
  postTask,
  getUserTasks,
  deleteTaskById,
} = require("../controllers/taskController.js");

const taskRouter = express.Router();

taskRouter.use(validateTokenId, verifyTokenId);

taskRouter.post("/", postTask);

taskRouter.get("/user", getUserTasks);

taskRouter.delete("/:id", deleteTaskById);

module.exports = taskRouter;
