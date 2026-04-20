const admin = require("firebase-admin");

const FIREBASE_SERVICE_KEY = process.env.FIREBASE_SERVICE_KEY;

if (!FIREBASE_SERVICE_KEY?.trim()) {
  throw new Error(
    "FIREBASE_SERVICE_KEY is not defined in environment variables",
  );
}

const decoded = Buffer.from(FIREBASE_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

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
