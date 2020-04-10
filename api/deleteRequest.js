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
  mongoInterface.Task.deleteOne({_id: ObjectId(id)})
  .then(
    () => {
      response.send(200);
    }
  )
  .catch(
    (error) => {
      console.error(error);
      response.send(400);
    }
  );
};
