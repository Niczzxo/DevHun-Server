const { ObjectId } = require("mongodb");
const { tasksCollection } = require("../config/db.js");

const postTask = async (req, res) => {
  const newTask = req.body;

  try {
    const result = await tasksCollection.insertOne(newTask);

    res.send({
      success: true,
      message: "Task posted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Task post failed",
    });
  }
};

const getUserTasks = async (req, res) => {
  const { email } = req.query;
  const pipeline = [
    {
      $match: {
        accepted_user_email: email,
      },
    },
    {
      $addFields: {
        jobObjId: {
          $convert: {
            input: "$job_id",
            to: "objectId",
          },
        },
      },
    },
    {
      $lookup: {
        from: "all_jobs",
        localField: "jobObjId",
        foreignField: "_id",
        as: "job_details",
      },
    },
    {
      $unwind: "$job_details",
    },
  ];

  try {
    const result = await tasksCollection
      .aggregate(pipeline)
      .project({
        accepted_user_name: 1,
        job_details: 1,
        accepted_user_email: 1,
      })
      .toArray();

    res.send({
      success: true,
      message: "Task jobs data retrieved successfully",
      user_tasks: result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Task jobs data retrieved failed",
    });
  }
};

const deleteTaskById = async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };

  try {
    const result = await tasksCollection.deleteOne(query);

    res.send({
      success: true,
      message: "Task deleted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Task delete failed",
    });
  }
};

module.exports = { postTask, getUserTasks, deleteTaskById };
