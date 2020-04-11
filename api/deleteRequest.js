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
                response.status(200).json({"message" : "Request removed successfully"});
            }
              ).catch(
                      (error) => {
                  console.error("Error with removeRequest");
                  console.error(error);
                  response.status(400).json(error);
              }
                      )
    
};
