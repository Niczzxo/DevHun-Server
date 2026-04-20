const express = require("express");
const validateTokenId = require("../middlewares/validateTokenId.js");
const verifyTokenId = require("../middlewares/verifyTokenId.js");
const { getDashboardStats } = require("../controllers/dashboardController.js");

const dashboardRouter = express.Router();

/**
 * @route   GET /dashboard/stats
 * @desc    Get aggregated dashboard statistics
 * @access  Private (Valid & Verified Token Required)
 */


dashboardRouter.use(validateTokenId, verifyTokenId);


dashboardRouter.get("/stats", getDashboardStats);

module.exports = dashboardRouter;
