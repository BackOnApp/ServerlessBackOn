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
        console.log('Task removed!')
        response.status(200).json({"result":"Task removed!"});
    }
          ).catch(
                  (error) => {
              console.error("Error with addTask");
              console.error(error);
              response.status(400).json(error);
          }
                  );
};
