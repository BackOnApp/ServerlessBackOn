const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;
const apn = require("apn")

module.exports = async (userID) => {
   await mongoInterface.User.findById(ObjectId(userID))
   .then(
      async (user) => {
         let deviceTokens = Array.from(user.devices.keys());
         let provider = new apn.Provider({
            cert: "public/BackOn.pem",
            key: "public/BackOn.pem",
            production: false
         });
         var notification = new apn.Notification();
         notification.alert = "Don't worry, be happy";
         notification.badge = 0;
         notification.topic = "it.unisa.applefoundationprogram.BackOn";
         await provider.send(notification, ["447e136c068ed862c6ec0fb98951c2435ff054d04b6ff2c98e0f1752479cae2e"])
         .then(
            (res) => {
               console.log(res);
            }
         )
      }
   )
   .catch (
      (err) => {
         console.error(err);
      }
   )
}
