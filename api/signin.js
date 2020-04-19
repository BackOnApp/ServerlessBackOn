const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;

module.exports = (request, response) => {
    if(request.body._id){
        mongoInterface.User.findById({_id : ObjectId(request.body._id)})
        .then(
            (existentuser) => {
            mongoInterface.Soul.findById({_id : ObjectId(request.body._id)})
            .then(
              (userSoul) => {
            if (existentuser != null) {
                if (request.body.deviceToken){
                    existentuser.devices.set(request.body.deviceToken, Date.now());
                    mongoInterface.User.updateOne({_id : ObjectId(existentuser._id)}, {$set: { "devices" : existentuser.devices}},
                                                  function (error, raw) {
                        if (error) {
                            console.log('Error log: ' + error)
                        } else {
                            console.log("Token updated: " + raw);
                        }
                    });
                }
                response.status(200).json(
                    {
                        name: existentuser.name,
                        surname: existentuser.surname,
                        photo: existentuser.photo,
                        caregiver: userSoul.caregiver,
                        housewife: userSoul.housewife,
                        runner: userSoul.runner,
                        smartassistant: userSoul.smartassistant
                    }
                );
            } 
        }
            )}
        )
        .catch(
               (error) => {
            console.error(error);
            response.status(400).json({
                "error": error
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
        var token=request.body.deviceToken;
        
        if (user != null)
            mongoInterface.User.findOne({email : user.email})
            .then(
                  (existentuser) => {
                if (existentuser != null) {
                    if(token != null){
                        existentuser.devices.set(token, Date.now());
                        mongoInterface.User.updateOne({_id : ObjectId(existentuser._id)}, {$set: { "devices" : existentuser.devices}},
                                                      function (error, raw) {
                            if (error) {
                                console.log('Error log: ' + error)
                            } else {
                                console.log("Token updated: " + raw);
                            }
                        });
                    }
                    response.status(200).json({_id: existentuser._id});
                    
                    user = null;
                } else {
                    console.log("Registering "+user);
                    if (token != null){
                        user.devices.set(token, Date.now());
                    }
                    user.save()
                    .then(
                          result => {
                        console.log("Registered user: "+result);
                        new mongoInterface.Soul({_id: result._id}).save()
                        .then(
                            () =>{
                                response.status(200).json({
                                    _id: result._id
                            });
                            
                        }
                          )
                        })
                    .catch(error => {
                        console.error(error);
                        response.status(400).json({
                            "error": error
                        });
                    });
                }
            }
                  )
            .catch(
                   (error) => {
                console.error(error);
                response.status(400).json({
                    "error": error
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
