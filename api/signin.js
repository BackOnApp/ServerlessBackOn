const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;

module.exports = (request, response) => {
  if(request.body._id){
    mongoInterface.User.findById({_id : ObjectId(request.body._id)})
    .then(
      (existentuser) => {
        if (existentuser != null) {
          var mappini = existentuser.devices;
          mappini.set(request.body.deviceToken, Date.now());
          mongoInterface.User.updateOne({_id : ObjectId(existentuser._id)}, {$set: { "devices" : mappini}},
          function (err, raw) {
            if (err) {
                console.log('Error log: ' + err)
            } else {
                console.log("Token updated: " + raw);
            }
          });

          response.status(200).json({_id: existentuser._id});
        } 
      }
    )
    .catch(
      (error) => {
        console.error(error);
        response.status(400).json({
          "error": err
        });
      }
    );

  }else{

    var user = new mongoInterface.User({
      name: request.body.name,
      surname: request.body.surname,
      email: request.body.email,
      photo: request.body.photo,
      devices: new Map()
    });
    var tok=request.body.deviceToken;
    user.devices.set(tok, Date.now());
  
    if (user != null)
      mongoInterface.User.findOne({email : user.email})
      .then(
        (existentuser) => {
          if (existentuser != null) {
            var mappini = existentuser.devices;
            mappini.set(tok, Date.now());
            mongoInterface.User.updateOne({_id : ObjectId(existentuser._id)}, {$set: { "devices" : mappini}},
            function (err, raw) {
              if (err) {
                  console.log('Error log: ' + err)
              } else {
                  console.log("Token updated: " + raw);
              }
            });
  
            response.status(200).json({_id: existentuser._id});
            
            user = null;
          } else {
            console.log("Registering "+user);
            user.save()
            .then(
              result => {
                console.log("Registered user: "+result);
                response.status(200).json({
                  _id: result._id
                });
              }
            )
            .catch(err => {
              console.error(err);
              response.status(400).json({
                "error": err
              });
            });
          }
        }
      )
      .catch(
        (error) => {
          console.error(error);
          response.status(400).json({
            "error": err
          });
        }
      );
    else {
      console.error("Error while creating User. Maybe there are missing fields in the request");
      response.status(400).json({
        "error": "Error while creating User. Maybe there are missing fields in the request"
      });
    }
  }
  
};