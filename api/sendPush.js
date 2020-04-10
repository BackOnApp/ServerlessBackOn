const apn = require("apn")

module.exports = (request, response) => {
   let provider = new apn.Provider({
      cert: "public/BackOn.pem",
      key: "public/BackOn.pem",
      production: false
   });

   let deviceTokens = ["64afd63b4ec4eba81e844ec053c4e5ab9aee224e3873f5e96ef16a4d6de6cc6f"];

   var notification = new apn.Notification();
   notification.alert = "Don't worry, be happy";
   notification.badge = 1;
   notification.topic = "it.unisa.applefoundationprogram.BackOn";

   provider.send(notification, deviceTokens).then( (res) => {
      console.log('ao');
      response.status(200).json(res);
   });
}
