const {google} = require('googleapis');
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const streamifier = require('streamifier');

//You have to put in TOKEN_PATH the token (obtained from a web browser at https://developers.google.com/oauthplayground) and the other required fields
//N.B. when you request the token you must select the drive access scope
//You have to put in CREDENTIALS_PATH the oAuth2 credentials obtained at https://console.developers.google.com/apis/credentials
//const TOKEN_PATH = 'public/g_token.json'; 
//const CREDENTIALS_PATH = 'public/g_credentials.json'; 

// in privatekey ci va il json dell'account di servizio dopo averlo esteso a tutto il dominio
let privatekey = require('public/g_serviceAccCred.json');

const mongoInterface = require('../mongoInterface');

module.exports = (request, response) => {
  const { body } = request;

  if (body._id == null) {
    console.error("_id field not found in request");
    response.send(400)//.json({"error" : "_id field not found in request"});
    return;
  }

  if(body.photo){

    // configure a JWT auth client
    let jwtClient = new google.auth.JWT(privatekey.client_email, null, privatekey.private_key, 'https://www.googleapis.com/auth/drive');
    //authenticate request
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.error(err);
            response.send(400)
            return;
        }
    });

    const drive = google.drive({version: 'v3'});

    var filename=`${body._id}.jpeg`;
    
    const fileMetadata = {
        'name': filename, 
        'parents':["1hHgPhnUFIXZBcZe4-LynuO8NZkDh0VXV"] // id della cartella condivisa (altrimenti salva nel drive del service account)
    };


    var buf = Buffer.from(body.photo, 'base64');

    const media = {
        mimeType: 'image/jpeg',
        body: streamifier.createReadStream(buf)
    };

    var fileid = "";
    drive.files.create({resource: fileMetadata, media: media, fields: 'id', auth: jwtClient }, (err, file) => {
        if (body.name&&body.surname&&err) {
            console.error(err);
            mongoInterface.User.updateOne({_id : ObjectId(body._id)}, { '$set': { 'name' : body.name , 'surname' : body.surname} } , {new: true}).then(
              () => {
                response.send(401)//.json({'name' : body.name , 'surname' : body.surname , "photoURL" : ""});
              }
            ).catch(
              (error) => {
                response.send(400)//.json({"err": err, "error" : error, 'name' : "" , 'surname' : "" , "photoURL" : ""});
              }
            );
        } else {
            fileid = file.data.id;
            console.log('Uploaded a file with ID: ', fileid);
            let dllink = "https://drive.google.com/uc?export=download&id="+fileid;
            mongoInterface.User.updateOne({_id : ObjectId(body._id)}, { '$set': { 'name' : body.name , 'surname' : body.surname , 'photo' : dllink} }).then(
              () => {
                response.send(200)//.json({'name' : body.name , 'surname' : body.surname , "photoURL" : dllink});
              }
            ).catch(
              (error) => {
                response.send(400)//.json({"error" : error,'name' : "" , 'surname' : "" , "photoURL" : ""});
              }
            );
        }
    });
  }else if(body.name&&body.surname&&!body.photo){
    mongoInterface.User.findByIdAndUpdate({_id : ObjectId(body._id)}, { '$set': { name : body.name, surname : body.surname} }, {new: true}).then(
        () => {
          response.send(401)//.json({'name' : body.name , 'surname' : body.surname , "photoURL" : ""});
        }
    ).catch(
        (error) => {
          response.send(400)//.json({"error" : error,'name' : "" , 'surname' : "" , "photoURL" : ""});
        }
    );
    
  }
  

}