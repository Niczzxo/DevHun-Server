const validateTokenId = async (req, res, next) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }

  req.token_id = token;
  next();
};

module.exports = validateTokenId;
