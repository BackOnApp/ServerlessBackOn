const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;


module.exports = (request, response) => {
  var user = new mongoInterface.User({
    _id: ObjectId.createFromHexString("9f92fbb50b34db2a9b04141713d11a7bd3457d2334b530249a21846a59f779c3"),
    name: "Gian",
    surname: "Sorr",
    email: "maillll@mmail.mail",
    photo: "URL",
    devices: ["primotoken", "secondoToken"]
  });
  user.save();
}