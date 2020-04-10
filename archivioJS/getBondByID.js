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
  mongoInterface.Task.findOne({_id: ObjectId(id)})
  .then(
    (task) => {
      response.status(200).json(task);
    }
  )
  .catch(
    (error) => {
      response.status(404).json({
        error: error
      });
    }
  );
};
