const { ObjectId } = require("mongodb");
const { jobsCollection } = require("../config/db.js");

const getJobs = async (req, res) => {
  let query = {};
  let sortObj = {};
  let projectField = {};

  const {
    search,
    job_category,
    job_type,
    location,
    experience_level,
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    limit = 12,
    fields,
    excludes,
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit))); // cap at 100
  const skipNum = (pageNum - 1) * limitNum;

  // Sorting
  const order = sortOrder === "asc" ? 1 : -1;
  sortObj[sortBy] = order;

  // Text Search
  if (search?.trim()) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    query.$or = [
      { job_title: searchRegex },
      { job_summary: searchRegex },
      { posted_by: searchRegex },
    ];
  }

  // Filters
  if (job_category?.trim()) query.job_category = job_category.trim();
  if (job_type?.trim()) query.job_type = job_type.trim();
  if (location?.trim()) {
    query.location = { $regex: location.trim(), $options: "i" };
  }
  if (experience_level?.trim())
    query.experience_level = experience_level.trim();

  // Field Projection
  if (fields?.trim()) {
    fields.split(",").forEach((field) => {
      projectField[field.trim()] = 1;
    });
  }

  if (excludes?.trim()) {
    excludes.split(",").forEach((field) => {
      projectField[field.trim()] = 0;
    });
  }

  // If no projection specified, exclude sensitive/large fields by default
  if (Object.keys(projectField).length === 0) {
    projectField = {
      creator_email: 0,
      requirements: 0,
      responsibilities: 0,
      benefits: 0,
      company_description: 0,
    };
  }

  try {
    // Get total count for pagination
    const total = await jobsCollection.countDocuments(query);

    // Fetch jobs
    const jobs = await jobsCollection
      .find(query)
      .sort(sortObj)
      .skip(skipNum)
      .limit(limitNum)
      .project(projectField)
      .toArray();

    res.status(200).json({
      success: true,
      message: "Jobs retrieved successfully",
      jobs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalJobs: total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve jobs",
    });
  }
};

const getUserJobs = async (req, res) => {
  const query = {};
  const userEmail = req.query.email;

  if (userEmail !== req.token_email) {
    res.status(403).send({ message: "Forbidden Access" });
    return;
  }

  if (userEmail) {
    query.creator_email = userEmail;
  }

  try {
    const result = await jobsCollection.find(query).toArray();

    res.send({
      success: true,
      message: "User jobs data successfully retrieved",
      user_jobs: result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "User jobs data retrieved failed",
    });
  }
};

const postJob = async (req, res) => {
  const newJob = req.body;
  newJob.created_at = new Date().toISOString();
  newJob.status = "pending";

  try {
    const result = await jobsCollection.insertOne(newJob);

    res.send({
      ...result,
      success: true,
      message: "Job data posted successfully",
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Job data post failed",
    });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };

  try {
    const result = await jobsCollection.findOne(query);
    res.send({
      success: true,
      message: "Single job data retrieved successfully",
      single_job: result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Single job data retrieved failed",
    });
  }
};

const updateJobById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  const updatedJob = req.body;
  const update = {
    $set: updatedJob,
  };

  try {
    const result = await jobsCollection.updateOne(query, update);

    res.send({
      success: true,
      message: "Job data updated successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Job data update failed",
    });
  }
};

const deleteJobById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };

  try {
    const result = await jobsCollection.deleteOne(query);

    res.send({
      success: true,
      message: "Job data deleted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Job data delete failed",
    });
  }
};

module.exports = {
  getJobs,
  getUserJobs,
  getJobById,
  postJob,
  updateJobById,
  deleteJobById,
};
