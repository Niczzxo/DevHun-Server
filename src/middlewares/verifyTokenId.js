const admin = require("firebase-admin");

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY;

let isFirebaseInitialized = false;

if (!FIREBASE_SERVICE_KEY?.trim()) {
  console.warn("WARNING: FIREBASE_SERVICE_KEY is missing. Firebase Auth will fail.");
} else {
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
      console.error("Failed to parse FIREBASE_SERVICE_KEY. Invalid JSON/Base64.");
    }
  }

  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    isFirebaseInitialized = true;
  }
}

const verifyTokenId = async (req, res, next) => {
  if (!isFirebaseInitialized) {
    return res.status(500).send({ message: "Firebase Admin is not configured on the server." });
  }

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
