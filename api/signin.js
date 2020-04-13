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
                                                  function (err, raw) {
                        if (err) {
                            console.log('Error log: ' + err)
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
        var token=request.body.deviceToken;
        
        if (user != null)
            mongoInterface.User.findOne({email : user.email})
            .then(
                  (existentuser) => {
                if (existentuser != null) {
                    if(token != ''){
                        existentuser.devices.set(token, Date.now());
                        mongoInterface.User.updateOne({_id : ObjectId(existentuser._id)}, {$set: { "devices" : existentuser.devices}},
                                                      function (err, raw) {
                            if (err) {
                                console.log('Error log: ' + err)
                            } else {
                                console.log("Token updated: " + raw);
                            }
                        });
                    }
                    response.status(200).json({_id: existentuser._id});
                    
                    user = null;
                } else {
                    console.log("Registering "+user);
                    if (token != ''){
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
