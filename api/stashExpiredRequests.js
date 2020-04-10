const ObjectId = require('mongodb').ObjectId;
const mongoInterface = require('../mongoInterface');

//check server date system consistency
module.exports = (request, response) => {
  let ts = Date.now();
  let date_ob = new Date(ts);

  var taskids=[];
  mongoInterface.Task.find({ date: { $lte: date_ob } })
  .then(
    (tasks) => {
      var stashedtasks=[];
      tasks.forEach(element => {
        //var elementDate = new Date(element["date"].toISOString());
        let stashedtask = new mongoInterface.StashedTask({
          _id: ObjectId(element["_id"]),
          title: element["title"],  
          description: element["description"],
          neederID: ObjectId(element["neederID"]),
          date: element["date"],
          latitude: element["latitude"],
          longitude: element["longitude"],
          helperID: ObjectId(element["helperID"]),
          helperReport: element["helperReport"],
          neederReport: element["neederReport"]
        });
        stashedtasks.push(stashedtask);
        taskids.push(element["_id"]);
      });

      
      mongoInterface.StashedTask.insertMany(stashedtasks).then(
        (res) => {
          response.status(200).json({res,"aaaa":"aaaaaaa"});
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

  mongoInterface.Task.deleteMany({ _id: { $in: taskids } }).then(
    () => {
      
    }
  ).catch(
    (error) => {

    }
  );
};

