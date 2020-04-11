const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;
const sendPush = require("public/sendPush.js")

module.exports = (request, response) => {
  let id = request.body._id;
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400).json({
      "error" : "_id field not found in request"
    });
    return;
  }
  mongoInterface.Task.findById({_id: ObjectId(id)})
  .then( 
    (task) => {
      mongoInterface.Task.deleteOne({_id: ObjectId(id)})
      .then(
       async () => {
        if (task.helperID != null){
          await sendPush(task.helperID, 'A quanto pare per '.concat(task.title, 'il needer è diventato autosufficiente'));
          response.status(200).json({"result":"Request removed!"});
      } else {
        response.status(200).json({"message" : "Request removed successfully"});
      }
    }
    ).catch(
      (error) => {
        console.error("Error with removeRequest");
        console.error(error);
        response.status(400).json(error);
      }
    )
    }).catch(
    (error) => {
      console.error("Error in finding Request");
      console.error(error);
      response.status(400).json(error);
    });
};
