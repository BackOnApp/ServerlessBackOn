const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;
const sendPush = require("public/sendPush.js")

module.exports = (request, response) => {
  console.log('È solo una prova...');
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
    async (task) => {
      if (task.helperID != null){
        console.log('Ciao, sono io, Topolinno!');
        await sendPush(task.helperID, 'A quanto pare per '.concat(task.title, 'il needer è diventato autosufficiente'));
        console.log('Request removed!');
        response.status(200).json({"result":"Request removed!"});
    } else {
      console.log('Sei scemo')
      response.status(200).json({"message" : "Request removed successfully"});
    }
  }
  ).catch(
    (error) => {
      console.error("Error with removeRequest");
      console.error(error);
      response.status(400).json(error);
    }
  );
};
