const admin = require("firebase-admin");

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY;

const initializeFirebase = () => {

  if (admin.apps.length > 0) return true;


  if (!FIREBASE_SERVICE_KEY) {
    console.error("Firebase Service Key is missing in environment variables.");
    return false;
  }

  try {
    let serviceAccount;


    const sanitizedKey = FIREBASE_SERVICE_KEY.replace(/\\n/g, '\n');

    try {

      serviceAccount = JSON.parse(sanitizedKey);
    } catch (e) {

      const decoded = Buffer.from(FIREBASE_SERVICE_KEY, "base64").toString("utf8");
      serviceAccount = JSON.parse(decoded);
    }


    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin initialized successfully.");
    return true;
  } catch (error) {
    console.error("Firebase initialization failed:", error.message);
    return false;
  }
};

const verifyTokenId = async (req, res, next) => {

  if (!initializeFirebase()) {
    return res.status(500).send({
      success: false,
      message: "Server configuration error: Firebase not ready."
    });
  }


  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized: No token provided"
    });
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = await admin.auth().verifyIdToken(token);


    req.token_email = decoded.email;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).send({
      success: false,
      message: "Unauthorized: Invalid or expired token"
    });
  }
};

module.exports = verifyTokenId;
