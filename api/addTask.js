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
      await sendPush(task.neederID);
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

/*
mongoInterface.User.findById(ObjectId(task.neederID))
      .then(
        (user) => {
          let deviceTokens = Array.from(user.devices.keys());
          let provider = new apn.Provider({
            cert: "public/BackOn.pem",
            key: "public/BackOn.pem",
            production: false
          });
          console.log(deviceTokens);
          var notification = new apn.Notification();
          notification.alert = task.title;
          notification.badge = 0;
          notification.topic = "it.unisa.applefoundationprogram.BackOn";
          provider.send(notification, deviceTokens)
          .then(
            (res) => {
              console.log(res);
              response.status(200).json(res);
            }
          )
        }
      )
      .catch (
        (err) => {
          console.error("Error while getting the needer");
          console.error(err);
        }
      )
*/
