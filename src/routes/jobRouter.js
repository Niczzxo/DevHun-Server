const express = require("express");
const validateTokenId = require("../middlewares/validateTokenId.js");
const verifyTokenId = require("../middlewares/verifyTokenId.js");
const {
  getJobs,
  postJob,
  updateJobById,
  deleteJobById,
  getJobById,
  getUserJobs,
} = require("../controllers/jobController.js");

const jobRouter = express.Router();


jobRouter.get("/", getJobs);


jobRouter.get("/id/:id", getJobById);



jobRouter.get("/user", validateTokenId, verifyTokenId, getUserJobs);


jobRouter.post("/", validateTokenId, verifyTokenId, postJob);


jobRouter.route("/:id")
  .put(validateTokenId, verifyTokenId, updateJobById)
  .delete(validateTokenId, verifyTokenId, deleteJobById);

module.exports = jobRouter;
