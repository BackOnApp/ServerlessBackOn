const mongoInterface = require('../mongoInterface');

module.exports = (request, response) => {
  mongoInterface.User.find()
  .then(
    (users) => {
      response.status(200).json(users);
    }
  )
  .catch(
    (error) => {
      response.status(400).json({
        error: error
      });
    }
  );
};
