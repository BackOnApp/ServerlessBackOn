const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;

module.exports = (request, response) => {
  let id = request.body._id
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400).json({
      "error" : "_id field not found in request"
    });
    return;
  }
  mongoInterface.Task.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [ request.body.longitude, request.body.latitude] },
        query: { helperID: null, neederID: {$ne : ObjectId(id)} },
        distanceField: "distance",
        maxDistance: 750000
     }
    },
    {
      $lookup: {
          from: "users",
          localField: "neederID",
          foreignField: "_id",
          as: "user"
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
      console.log(error)
      response.status(400).json({
        error: error
      });
    }
  );
};
