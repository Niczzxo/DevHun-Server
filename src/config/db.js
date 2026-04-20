const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

let client = null;
let jobsCollection = null;
let tasksCollection = null;

if (uri?.trim()) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  const database = client.db("DevHun-db");
  jobsCollection = database.collection("all_jobs");
  tasksCollection = database.collection("added_tasks");
}

module.exports = {
  client,
  get jobsCollection() {
    if (!jobsCollection) {
      throw new Error("MONGODB_URI is not defined in environment variables. Please set it in the Secrets panel.");
    }
    return jobsCollection;
  },
  get tasksCollection() {
    if (!tasksCollection) {
      throw new Error("MONGODB_URI is not defined in environment variables. Please set it in the Secrets panel.");
    }
    return tasksCollection;
  }
};
