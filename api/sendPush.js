const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;
const apn = require("apn")

module.exports = (request, response) => {
    console.log(request.body.receiverID)
     mongoInterface.User.findById(request.body.receiverID)
    .then(
          async (receiver) => {
        let deviceTokens = Array.from(receiver.devices.keys());
        if (deviceTokens.length>0){
            let provider = new apn.Provider({
            cert: "public/BackOn.pem",
            key: "public/BackOn.pem",
            production: false
            });
            var notification = new apn.Notification();
            notification.alert = {'title' : request.body.title, 'body' : request.body.body};
            notification.badge = 1;
            notification.sound = 'default';
            notification.topic = "it.unisa.applefoundationprogram.BackOn";
            await provider.send(notification, deviceTokens)
            .then(
                  (res) => {
                console.log(res);
                response.status(200)
            }
                  )
        }
        response.status(200)
    }
    
          )
    .catch (
            (err) => {
        console.error(err);
    }
            )
}
