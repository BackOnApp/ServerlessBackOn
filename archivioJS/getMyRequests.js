const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;

module.exports = (request, response) => {
  let id = request.body._id;
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400).json({
      "error" : "_id field not found in request"
    });
    return;
  }
  mongoInterface.Task.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "helperID",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $match: {
        neederID: ObjectId(id)
      }
    }
  ])
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