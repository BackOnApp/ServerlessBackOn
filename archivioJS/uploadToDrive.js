const {google} = require('googleapis');
const fs = require('fs');

//You have to put in TOKEN_PATH the token (obtained from a web browser at https://developers.google.com/oauthplayground) and the other required fields
//N.B. when you request the token you must select the drive access scope
//You have to put in CREDENTIALS_PATH the oAuth2 credentials obtained at https://console.developers.google.com/apis/credentials
//const TOKEN_PATH = 'public/g_token.json'; 
//const CREDENTIALS_PATH = 'public/g_credentials.json'; 

// in privatekey ci va il json dell'account di servizio dopo averlo esteso a tutto il dominio
let privatekey = require('public/serviceAccCred.json');


// Load client secrets from a local file.
module.exports = (request, response) => {
    // configure a JWT auth client
    let jwtClient = new google.auth.JWT(privatekey.client_email, null, privatekey.private_key, 'https://www.googleapis.com/auth/drive');
    //authenticate request
    jwtClient.authorize(function (err, tokens) {
        if (err) {
            console.error(err);
            return;
        }
    });

    const drive = google.drive({version: 'v3'});
    const fileMetadata = {
        'name': 'photo.png', //da modificare
        'parents':["1hHgPhnUFIXZBcZe4-LynuO8NZkDh0VXV"] // id della cartella condivisa (altrimenti salva nel drive del service account)
    };
    const media = {
        mimeType: 'image/png',
        body: fs.createReadStream('public/backonicon.png') // per ora carica una foto dal locale
    };
    var fileid = ""

    drive.files.create({resource: fileMetadata, media: media, fields: 'id', auth: jwtClient }, (err, file) => {
        if (err) {
            console.error(err);
            response.status(400).json({"error" : err});
        } else {
            fileid = file.data.id
            console.log('Uploaded a file with ID: ', fileid);
            let dllink = "https://drive.google.com/uc?export=download&id="+fileid;
            response.status(200).json({"Image Link":dllink});
        }
    });
    
}

/*
drive.files.list({pageSize: 10, fields: 'nextPageToken, files(id, name)', auth: jwtClient}, (err, res) => {
    if (err) {
        console.error('The API returned an error: ' + err);
        response.status(400).json({"error": err});
        return;
    }
    const files = res.data.files;
    if (files.length) {
        console.log('Files:');
        files.map((file) => {
            console.log(`${file.name} (${file.id})`);
        });
    } else {
        console.log('No files found');
    }
});
*/