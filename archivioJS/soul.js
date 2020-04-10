const Soul = require('../models/soul');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectID;



exports.getAll = (req, res, next) => {
  //User.findOne({_id: ObjectId("5e753491d64d14811fb2216f")}).then(
  Soul.find().then(
    (souls) => {
      res.status(200).json(souls);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.birth = (req, res, next) => {

  var soul = new Soul({
    _id: ObjectId("5e753ee06ec65b85662ca389"),
    timeinvestor: 10.0,
    resourceful: 10.0,
    longrunner: 10.0,
    petlover: 10.0,
    socialbeast: 10.0,
    helped: 0,
    unsolved: 0,
    solved: 0,
    thumbsup: 0,
    thumbsupgiven: 0,
    thumbsdown: 0,
    thumbsdowngiven: 0
  });
  
  if(soul._id!=null) 
    soul.save().then(
      result => {
        console.log("signup\n"+result);
        res.status(200).json({
                  _id: result._id
        });
    }).catch(err => {
                console.log(err);
    });
  else res.status(400).json({
    _id: null
  });
};