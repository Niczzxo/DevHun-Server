const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env");
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db("DevHun-db");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

const getCollections = async () => {
  const { db } = await connectToDatabase();
  return {
    jobsCollection: db.collection("all_jobs"),
    tasksCollection: db.collection("added_tasks"),
    usersCollection: db.collection("users")
  };
};

module.exports = { connectToDatabase, getCollections };
