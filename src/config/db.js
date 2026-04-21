const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri?.trim()) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("DevHun-db");
const jobsCollection = database.collection("all_jobs");
const tasksCollection = database.collection("added_tasks");

module.exports = { client, jobsCollection, tasksCollection };
