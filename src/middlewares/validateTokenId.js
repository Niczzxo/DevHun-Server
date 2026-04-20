const validateTokenId = async (req, res, next) => {
  const authorization = req.headers?.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized Access: No token provided"
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized Access: Token is malformed"
    });
  }

  req.token_id = token;


  next();
};

module.exports = validateTokenId;
