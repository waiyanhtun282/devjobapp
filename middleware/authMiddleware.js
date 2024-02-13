const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // if get token from header
  const token = req.header("x-auth-token");

  //  check if not token
  if (!token) {
    return res.status(401).json({ msg: "No Token,authrizoation is denied!" });
  }

  // verify token
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "token is not valid!" });
  }
};
