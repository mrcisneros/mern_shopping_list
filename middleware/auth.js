/** @format */

const config = require("config");
const jwt = require("jsonwebtoken");

/*The purpose of this function is to get the token that's sent from either react postman, angular */
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  //Check for token
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied." });
  try {
    //Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid." });
  }
}
module.exports = auth;
/*In conclusion, whenever we want a private route we could simple add this middleware as a second
parameter in the end point. For instnce, let go to try it in the item route.
For that we are going to follow the next:
1.- Bring in the middleware function.:
    const auth = require('../../middleware/auth')
2.-The to protect the post method, we just add auth as a second paraneter:
    router.post("/", auth, (req, res)...
    Add this for delete as well:
    router.delete("/:id", auth, (req, res) ... */
