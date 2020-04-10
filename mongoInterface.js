const mongoose = require('mongoose');
const uri = 'mongodb+srv://root:root@backon-nm2n7.mongodb.net/test?retryWrites=true&w=majority';
const uniqueValidator = require('mongoose-unique-validator');
const Double = require('@mongoosejs/double');
const ObjectId = require('mongodb').ObjectId;

mongoose.connection.on('connected', () => {
  console.log('Connection Established')
})
mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished')
})
mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected')
})
mongoose.connection.on('close', () => {
  console.log('Connection Closed')
})
mongoose.connection.on('error', (error) => {
  console.error('ERROR: ' + error)
})

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String, required: false},
  neederID: { type: ObjectId, required: true},
  latitude: { type: Double, required: true},
  longitude: { type: Double, required: true},
  date: { type: Date, required: true},
  helperID: { type: ObjectId, required: false},
  helperReport: { type: String, required: false},
  neederReport: { type: String, required: false}
});
const userSchema = mongoose.Schema({
  name: { type: String, required: true},
  surname: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  photo: { type: String, required: true},
  devices: {
            //type: Array, required: true
           }
});
userSchema.plugin(uniqueValidator);
const soulSchema = mongoose.Schema({
  timeinvestor: { type: Double, required: true},
  resourceful: { type: Double, required: true},
  longrunner: { type: Double, required: true},
  petlover: { type: Double, required: true},
  socialbeast: { type: Double, required: true},
  helped: { type: Number, required: true},
  unsolved: { type: Number, required: true},
  solved: { type: Number, required: true},
  thumbsup: { type: Number, required: true},
  thumbsupgiven: { type: Number, required: true},
  thumbsdown: { type: Number, required: true},
  thumbsdowngiven: { type: Number, required: true}
});
const stashedTaskSchema = mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String, required: false},
  neederID: { type: ObjectId, required: true},
  latitude: { type: Double, required: true},
  longitude: { type: Double, required: true},
  date: { type: Date, required: true},
  helperID: { type: ObjectId, required: false},
  helperReport: { type: String, required: false},
  neederReport: { type: String, required: false}
});

var connected = false;

if (connected == false) {
  console.log("creating a new connection");
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, socketTimeoutMS: 30000, keepAlive: true})
  connected = true;
} else {
  console.log("using an existing connection");
  console.log(mongoose.connection.host);
}


var userModel = mongoose.model('User', userSchema);
var taskModel = mongoose.model('Task', taskSchema);
var stashedTaskModel = mongoose.model('StashedTask', stashedTaskSchema);
var soulModel = mongoose.model('Soul', soulSchema);
exports.User = userModel;
exports.Task = taskModel;
exports.StashedTask = stashedTaskModel;
exports.Soul = soulModel;

/*const mongoose = require('mongoose');

let cachedDb = null;

function connectToDatabase() {
  if (cachedDb != null) {
    console.log('Using cached database instance');
    return;
  }
  // If no connection is cached, create a new one
  const db = mongoose.connect('mongodb+srv://root:root@backon-nm2n7.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
  .then(() => {
    console.log('Successfully connected to BackOn MongoDB Atlas v2!');
  })
  .catch((error) => {
    console.log('Unable to connect to BackOn MongoDB Atlas v2!');
    console.error(error);
  });
  // Cache the database connection and return the connection
  cachedDb = db;
  console.log('Using new instance');
  return;
}

module.exports = connectToDatabase
*/
