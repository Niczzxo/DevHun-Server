const admin = require("firebase-admin");

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY;
let isInitialized = false;

const initializeFirebase = () => {
  if (isInitialized) return true;
  if (!FIREBASE_SERVICE_KEY?.trim()) return false;

  try {
    let serviceAccount;
    // Try parsing as raw JSON first
    try {
      serviceAccount = JSON.parse(FIREBASE_SERVICE_KEY);
    } catch (e) {
      // If parsing fails, try decoding from base64
      const decoded = Buffer.from(FIREBASE_SERVICE_KEY, "base64").toString("utf8");
      serviceAccount = JSON.parse(decoded);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    isInitialized = true;
    return true;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return false;
  }
};

const verifyTokenId = async (req, res, next) => {
  if (!initializeFirebase()) {
    return res.status(500).send({ 
      success: false, 
      message: "Firebase configuration is missing. Please set FIREBASE_SERVICE_KEY in the Secrets panel." 
    });
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
