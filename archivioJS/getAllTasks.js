const mongoInterface = require('../mongoInterface');

module.exports = (request, response) => {
  mongoInterface.Task.aggregate([{
    $lookup: {
        from: "users",
        localField: "neederID",
        foreignField: "_id",
        as: "user"
    }
  }])
  .then(
    (tasks) => {
      response.status(200).json(tasks);
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