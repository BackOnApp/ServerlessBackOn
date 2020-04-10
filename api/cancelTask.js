const mongoInterface = require('../mongoInterface');
const sendPush = require("public/sendPush.js")

module.exports = (request, response) => {
  let id = request.body._id;
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400);
    return;
  }
  mongoInterface.Task.findByIdAndUpdate(id, {'$set': {helperID : null}})
  .then(
    async (task) => {
      await sendPush(task.neederID, 'Niente più aiuto per '.concat(task.title));
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