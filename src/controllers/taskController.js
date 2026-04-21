const { ObjectId } = require("mongodb");
const { getCollections } = require("../config/db.js");

const getUserTasks = async (req, res) => {
  const userEmail = req.query.email;

  if (userEmail !== req.token_email) {
    return res.status(403).send({ message: "Forbidden Access" });
  }

  try {
    const { tasksCollection } = await getCollections();
    const result = await tasksCollection.find({ creator_email: userEmail }).toArray();

    res.send({
      success: true,
      message: "User tasks data successfully retrieved",
      user_tasks: result,
    });
  } catch (error) {
    console.error("getUserTasks error:", error);
    res.status(500).send({
      success: false,
      message: "User tasks data retrieved failed",
    });
  }
};

const postTask = async (req, res) => {
  const newTask = req.body;
  newTask.created_at = new Date().toISOString();
  newTask.status = "pending";

  try {
    const { tasksCollection } = await getCollections();
    const result = await tasksCollection.insertOne(newTask);

    res.send({
      ...result,
      success: true,
      message: "Task data posted successfully",
    });
  } catch (error) {
    console.error("postTask error:", error);
    res.status(500).send({
      success: false,
      message: "Task data post failed",
    });
  }
};

const deleteTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const { tasksCollection } = await getCollections();
    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    res.send({
      success: true,
      message: "Task data deleted successfully",
      ...result,
    });
  } catch (error) {
    console.error("deleteTaskById error:", error);
    res.status(500).send({
      success: false,
      message: "Task data delete failed",
    });
  }
};

module.exports = {
  getUserTasks,
  postTask,
  deleteTaskById,
};
