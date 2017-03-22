var userController = function(User) {

  var profileRead = function (req, res) {
    if (!req.payload._id) {
      res.status(401).json({
        "message" : "UnauthorizedError: private profile"
      });
    } else {
      User
        .findById(req.payload._id)
        .exec(function(err, user) {
          res.status(200).json(user);
        });
    }
  };

  return {
    profileRead: profileRead
  };
};

module.exports = userController;