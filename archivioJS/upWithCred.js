const fs = require('fs');
const {google} = require('googleapis');

//You have to put in TOKEN_PATH the token (obtained from a web browser at https://developers.google.com/oauthplayground) and the other required fields
//N.B. when you request the token you must select the drive access scope
//You have to put in CREDENTIALS_PATH the oAuth2 credentials obtained at https://console.developers.google.com/apis/credentials
const TOKEN_PATH = 'public/g_token.json'; 
const CREDENTIALS_PATH = 'public/g_credentials.json'; 


// Load client secrets from a local file.
module.exports = (request, response) => {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err) {
            response.status(400);
            console.error('Error loading client secret file: ', err);
            return;
        };
        const {client_secret, client_id} = JSON.parse(content).web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
        // Load the token file.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                response.status(400);
                console.error('You have to generate a token and to put it in TOKEN_PATH'); // obtain it at https://developers.google.com/oauthplayground/
                return;
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            oAuth2Client.getAccessToken();

            //here the google api function begins
            const drive = google.drive({version: 'v3', oAuth2Client});
            drive.files.list({pageSize: 10, fields: 'nextPageToken, files(id, name)'}, (err, res) => {
                if (err) {
                    response.status(400);
                    console.error('The API returned an error: ' + err);
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
            response.status(200);
        });
    });
}
