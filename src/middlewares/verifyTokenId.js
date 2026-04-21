const admin = require("firebase-admin");

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY;

if (!FIREBASE_SERVICE_KEY?.trim()) {
  throw new Error(
    "FIREBASE_SERVICE_KEY is not defined in environment variables",
  );
}

let serviceAccount;

try {
  // First, try parsing it directly in case it's a raw JSON string
  serviceAccount = JSON.parse(FIREBASE_SERVICE_KEY);
} catch (error) {
  // If parsing directly fails, try decoding it as base64
  try {
    const decoded = Buffer.from(FIREBASE_SERVICE_KEY, "base64").toString("utf8");
    serviceAccount = JSON.parse(decoded);
  } catch (decodeError) {
    console.error("Failed to parse FIREBASE_SERVICE_KEY. Ensure it is a valid JSON string or a base64 encoded JSON string.");
    throw new Error("Invalid FIREBASE_SERVICE_KEY format");
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyTokenId = async (req, res, next) => {
  const token = req.token_id;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.token_email = decoded.email;
    next();
  } catch {
    res.status(401).send({ message: "Unauthorized Access" });
  }
};

module.exports = verifyTokenId;
