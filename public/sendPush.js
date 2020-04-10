const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;
const apn = require("apn")

module.exports = async (userID, title, description) => {
   await mongoInterface.User.findById(ObjectId(userID))
   .then(
      async (user) => {
         let deviceTokens = Array.from(user.devices.keys());
         if (deviceTokens.length>0){
         let provider = new apn.Provider({
            cert: "public/BackOn.pem",
            key: "public/BackOn.pem",
            production: false
         });
         var notification = new apn.Notification();
         notification.alert = title;
         notification.badge = 0;
         notification.topic = "it.unisa.applefoundationprogram.BackOn";
         await provider.send(notification, deviceTokens)
         .then(
            (res) => {
               console.log(res);
            }
         )
      }
   }
   )
   .catch (
      (err) => {
         console.error(err);
      }
   )
}
