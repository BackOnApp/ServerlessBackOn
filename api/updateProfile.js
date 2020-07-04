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

  if (body.logoutToken){
      console.log("Ci sono entrato, provo a rimuovere il token. Id utente: ")
      console.log(body._id)
      mongoInterface.User.findById({_id : ObjectId(body._id)}).then(
        (existentuser) => {
          existentuser.devices.delete(body.logoutToken);
          mongoInterface.User.updateOne({_id : ObjectId(existentuser._id)}, {$set: { "devices" : existentuser.devices}},
                          function (error, raw) {
                        if (error) {
                            console.log('Error log: ' + error)
                            response.status(400).json({
                              "error": error
                            });
                        } else {
                            console.log("Token deleted: " + raw);
                        }
                    });
          response.send(200);
        }
    ).catch(
        (error) => {
          response.send(400);
        }
    );
  }


  else {
    // Preparo mano mano il JSON di modifiche da apportare alla entry su MongoDB
    changes = {}

    if ("name" in body) {
      changes["name"] = body.name
    }

    if ("surname" in body) {
      changes["surname"] = body.surname
    }

    if ("phoneNumber" in body) {
      changes["phoneNumber"] = body.phoneNumber
    }

    new Promise((resolve) => {
      if(body.photo) {
        // Configure a JWT auth client
        let jwtClient = new google.auth.JWT(privatekey.client_email, null, privatekey.private_key, 'https://www.googleapis.com/auth/drive');
        // Authenticate request
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
            //id della cartella condivisa (altrimenti salva nel drive del service account)
            'parents':["1hHgPhnUFIXZBcZe4-LynuO8NZkDh0VXV"] 
        };

        var buf = Buffer.from(body.photo, 'base64');

        const media = {
            mimeType: 'image/jpeg',
            body: streamifier.createReadStream(buf)
        };

        var dllink = null
        drive.files.create({resource: fileMetadata, media: media, fields: 'id', auth: jwtClient }, (err, file) => {
            if (err) {
                console.error('Error while uploading picture on Google drive: ' + err);
                resolve('cannotUpdatePicture')
            } else {
                //Attenzione: Il fileid non è corrispondente al nome del file, perciò conserviamo le foto di tutti anche quando vengono sostituite con altre
                console.log('Uploaded a file with ID: ', file.data.id);
                //Inserisco nei cambiamenti il link da salvare sul db
                changes["photo"] = "https://drive.google.com/uc?export=download&id=" + file.data.id;
                resolve('pictureUpdated')
            }
        });

      }
      else resolve('noPictureToUpdate')
    }).then(() => {
      console.log(changes)
      if (changes != {}) {
        mongoInterface.User.updateOne({_id : ObjectId(body._id)}, {'$set': changes}, {new: true}).then(
             (resolveMessage) => {
              console.log('Successfully updated database entry!')
              response.send(200)
             }
        ).catch(
             (error) => {
              console.error('Eror while updating database entry: ' + error)
              response.send(400)
             }
         );
      }
    });
  }
}