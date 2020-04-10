const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;

module.exports = (request, response) => {
  let id = request.body._id;
  let idHelper = request.body.helperID
  if (id == null || idHelper == null) {
    console.error("_id or helperID field not found in request");
    response.status(400).json({
      "error" : "_id or helperID field not found in request"
    });
    return;
  }
  mongoInterface.Task.findByIdAndUpdate(id, { '$set': { helperID : ObjectId(idHelper)} }).then(
    () => {
      response.send(200);
    }
  ).catch(
    (error) => {
      response.send(400);
    }
  );
};
