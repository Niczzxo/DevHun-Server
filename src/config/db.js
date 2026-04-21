const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

let client;
let database;
let jobsCollection;
let tasksCollection;

if (!uri?.trim()) {
  console.warn("WARNING: MONGODB_URI is missing. Database operations will fail.");
} else {
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    database = client.db("DevHun-db");
    jobsCollection = database.collection("all_jobs");
    tasksCollection = database.collection("added_tasks");
  } catch (err) {
    console.error("Error initializing MongoDB:", err.message);
  }
}

module.exports = { client, jobsCollection, tasksCollection };
