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
    mongoInterface.Task.findOneAndUpdate({_id: id, helperID : null}, { $set: { helperID : idHelper , lastModified: new Date()}})
    .then(
           (task) => {
               if (task != null){
                console.log('Task added!')
                response.status(200).json({"result":"Task added!"})
               }
               else {
                console.log('Task already taken!')
                response.status(400).json({"result":"Task already taken"})
               }
    }
          ).catch(
                  (error) => {
              console.error("Error with addTask");
              console.error(error);
              response.status(400).json(error);
          }
                  );
};
