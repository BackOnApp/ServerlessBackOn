const mongoInterface = require('../mongoInterface');
const ObjectId = require('mongodb').ObjectId;

async function getRequests(id) {
  return mongoInterface.Task.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "helperID",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $match: {
        neederID: ObjectId(id)
      }
    }
  ])
}

async function getTasks(id) {
  return mongoInterface.Task.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "neederID",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $match: {
        helperID: ObjectId(id)
      }
    }
  ])
} 

module.exports = async (request, response) => {
  let id = request.body._id;
  if (id == null) {
    console.error("_id field not found in request");
    response.status(400).json({
      "error" : "_id field not found in request"
    });
    return;
  }
  try {
    let funcRequests = getRequests(id);
    let funcTasks = getTasks(id);
    let requests = await funcRequests;
    let tasks = await funcTasks;
    response.status(200).json({
      "tasks" : tasks,
      "requests" : requests
    })
  } catch(error) {
    console.error(error)
    response.status(400).json({
      "error" : error
    })
  }
}