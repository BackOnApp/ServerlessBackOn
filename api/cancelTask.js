const mongoInterface = require('../mongoInterface');

module.exports = (request, response) => {
  let id = request.body._id;
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400);
    return;
  }
  mongoInterface.Task.findByIdAndUpdate(id, {'$set': {helperID : null}})
  .then(
    () => {
      response.send(200);
    }
  ).catch(
    (error) => {
      response.send(400);
    }
  );
};