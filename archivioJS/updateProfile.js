const mongoInterface = require('../mongoInterface');

module.exports = (request, response) => {
  let id = request.body._id;
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400).json({
      "error" : "_id field not found in request"
    });
    return;
  }
  if(request.body.newName){
    mongoInterface.User.findByIdAndUpdate(id, { '$set': { name : String(request.body.newName)} }).then(
        () => {
        response.send(200);
        }
    ).catch(
        (error) => {
        response.send(400);
        }
    );
  }
  if(request.body.newSurname){
    mongoInterface.User.findByIdAndUpdate(id, { '$set': { surname : String(request.body.newSurname)} }).then(
        () => {
        response.send(200);
        }
    ).catch(
        (error) => {
        response.send(400);
        }
    );
  }
}