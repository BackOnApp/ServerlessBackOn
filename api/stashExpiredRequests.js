const ObjectId = require('mongodb').ObjectId;
const mongoInterface = require('../mongoInterface');

var dictionary = {
  "Disabled Assistance" : [7.5, 2.5, 0, 0],
  "Elder Care" : [6.5, 3.5, 0, 0],
  "Generic Errands" : [3.5, 0, 6.5, 0],
  "Going to the Pharmacy" : [3, 0, 7, 0],
  "Grocery Shopping" : [2.5, 0, 7.5, 0],
  "Houseworks" : [2.5, 7.5, 0, 0],
  "Pet Caring" : [2.5, 5.5, 2, 0],
  "Ride to a Doctor's Appointment" : [4.5, 0, 3.5, 2],
  "Sharing Time" : [5, 0, 0, 5],
  "Study Support" : [3, 0, 0, 7],
  "Tech Assistance" : [2, 0, 0, 8],
  "Wheelchair Transport" : [6.5, 0, 3.5, 0]
}

//check server date system consistency
module.exports = async (request, response) => {
  let ts = Date.now();
  let now = new Date(ts);
  let date_ob = new Date(now.getTime() - 1 * 86400 * 1000); //meno *1* giorni in millisecondi: 

  var tasksToDeleteIDs=[];
  await mongoInterface.Task.find({ date: { $lte: date_ob } }) //tutti i task con date <= date_ob
  .then(
    (tasks) => {
      var tasksToStash=[];
      tasks.forEach(element => {
        var helper=null
        if(element["helperID"]) helper = ObjectId(element["helperID"]);
        var title = element["title"]
        var helperReport = element["helperReport"]
        var neederReport = element["neederReport"]

        let taskToStash = new mongoInterface.StashedTask({
          _id: ObjectId(element["_id"]),
          title: title,  
          description: element["description"],
          neederID: ObjectId(element["neederID"]),
          date: element["date"],
          latitude: element["latitude"],
          longitude: element["longitude"],
          helperID: helper,
          helperReport: helperReport,
          neederReport: neederReport
        });
        tasksToStash.push(taskToStash);
        tasksToDeleteIDs.push(element["_id"]);

        if(helper){
          var helperMultiplier
          switch(helperReport) {
            case null:
              helperMultiplier = 1
              break;
            case "Thank you!":
              helperMultiplier = 2
              break;
            case "Didn't show up":
            case "Bad manners":
              helperMultiplier = -1
              break;
          }

          var neederMultiplier
          switch(neederReport) {
            case null:
              neederMultiplier = 1
              mongoInterface.Soul.findOneAndUpdate({_id :taskToStash.neederID}, {$inc : {solved : 1}}).exec()
              break;
            case "Thank you!":
              neederMultiplier = 2
              mongoInterface.Soul.findOneAndUpdate({_id :taskToStash.neederID}, {$inc : {solved : 1}}).exec()
              break;
            case "Didn't show up":
            case "Bad manners":
              neederMultiplier = -1
              mongoInterface.Soul.findOneAndUpdate({_id :taskToStash.neederID}, {$inc : {solved : 1}}).exec()
              break;
          }
          
          mongoInterface.Soul.findOneAndUpdate({_id : taskToStash.helperID}, {$inc : {helped : 1, thumbsup : helperMultiplier == 2 ? 1 : 0, thumbsdown : helperMultiplier == -1 ? 1 : 0, thumbsupgiven : neederMultiplier == 2 ? 1 : 0, thumbsdowngiven : neederMultiplier == -1 ? 1 : 0, caregiver : helperMultiplier * dictionary[title][0], housewife : helperMultiplier * dictionary[title][1], runner : helperMultiplier * dictionary[title][2], smartassistant : helperMultiplier * dictionary[title][3] }}).exec()
          mongoInterface.Soul.findOneAndUpdate({_id : taskToStash.neederID}, {$inc : {solved : 1, thumbsup : neederMultiplier == 2 ? 1 : 0, thumbsdown : neederMultiplier == -1 ? 1 : 0, thumbsupgiven : helperMultiplier == 2 ? 1 : 0, thumbsdowngiven : helperMultiplier == -1 ? 1 : 0}}).exec()
          
        }
        else {
          mongoInterface.Soul.findOneAndUpdate({_id : taskToStash.neederID}, {$inc : {unsolved : 1}}).exec()
        }


      }); //Fine forEach

      console.log(tasksToStash)
      mongoInterface.StashedTask.insertMany(tasksToStash).then(
        (res) => {
          response.status(200).json({res});
        }
      ).catch(
        (error) => {
          response.status(400).json({
            error: error
          });
        }
      );
    }
  )
  .catch(
    (error) => {
      response.status(400).json({
        error: error
      });
    }
  );
  
  mongoInterface.Task.deleteMany({ _id: { $in: tasksToDeleteIDs } }).then(
    () => {
      
    }
  ).catch(
    (error) => {

    }
  );
  
};