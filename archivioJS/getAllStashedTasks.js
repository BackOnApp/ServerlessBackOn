const mongoInterface = require('../mongoInterface');

module.exports = (request, response) => {
  mongoInterface.StashedTask.find()
  .then(
    stashedtasks => {
      response.status(200).json(stashedtasks);
    }
  )
  .catch(
    error => {
      res.status(400).json({
        error: error
      });
    }
  );
};
