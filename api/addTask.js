const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;
const sendPush = require("public/sendPush.js")

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
  mongoInterface.Task.findByIdAndUpdate(id, { '$set': { helperID : ObjectId(idHelper)} })
  .then(
    async (task) => {
      await sendPush(task.neederID, task.title.concat(' accettato!'));
      console.log('Task added!')
      response.status(200).json({"result":"Task added!"});
    }
  ).catch(
    (error) => {
      console.error("Error with addTask");
      console.error(error);
      response.status(400).json(error);
    }
  );
};
