
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

/**
 * Article authorizations routing middleware
 */
// exports.article = {
//     hasAuthorization: function(req, res, next) {
//         if (req.article.user.id != req.user.id) {
//             return res.send(401, 'User is not authorized');
//         }
//         next();
//     }
// };

// To verify a user token
exports.verifyToken = (req, res, next) => {
  // checking for token
  if (req.url.startsWith('/auth')) return next();

  const token = localStorage.getItem('JSONWT');
  // decoding the token
  if (token) {
    // verifies secret and checks
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.json({
          message: 'Failed to authenticate token.'
        });
      }
      // request user detail for other routes
      req.decoded = decoded;
      next();
    });
  } else {
    // return an error if no token
    return res.send({
      message: 'No token returned.'
    });
  }
};