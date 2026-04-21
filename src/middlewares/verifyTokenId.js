const admin = require("firebase-admin");

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY;

let isFirebaseInitialized = false;

if (!FIREBASE_SERVICE_KEY?.trim()) {
  console.warn("WARNING: FIREBASE_SERVICE_KEY is missing. Firebase Auth will fail.");
} else {
  let serviceAccount;
  const keyToParse = FIREBASE_SERVICE_KEY.trim();

  try {
    // Attempt 1: Direct JSON parsing
    serviceAccount = JSON.parse(keyToParse);
  } catch (error) {
    try {
      // Attempt 2: Base64 decoding
      const decoded = Buffer.from(keyToParse, "base64").toString("utf8");
      serviceAccount = JSON.parse(decoded);
    } catch (decodeError) {
      try {
        // Attempt 3: In case there are surrounding quotes that Vercel added
        const removeQuotes = keyToParse.replace(/^['"]|['"]$/g, "");
        serviceAccount = JSON.parse(removeQuotes);
      } catch (quoteError) {
        // Log safe prefix to debug what value was actually loaded
        const prefix = keyToParse.substring(0, 15);
        console.error(`Failed to parse FIREBASE_SERVICE_KEY. Invalid JSON/Base64. Starts with: ${prefix}...`);
      }
    }
  }

  if (serviceAccount && !admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isFirebaseInitialized = true;
    } catch (initErr) {
      console.error("Firebase Initialization Error:", initErr.message);
    }
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
