const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { file } = require('googleapis/build/src/apis/file');


const CLIENT_ID = "838279513253-tf0vb120mogiegp7tkp5147f09mgadhl.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04CfJp5cK3XjiCgYIARAAGAQSNwF-L9IrbdKoKzsBrYD7ONfCTTGxCadVr36JNLIdRyrfqx_HgAHIgiN9kDDfNvvOEIZE_EzF51w";
// Using the credentials to authenticate in Google API
const oauth2Client = new google.auth.OAuth2 (
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

//Last auth step
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Setting Drive API
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

async function upload()
{
    try {
    const buffer = fs.createReadStream(`./client/public/upload/${process.argv[2]}`);
    const response = await drive.files.create({
        requestBody: {
            name: 'default-banner', // Here goes the filename that will be uploaded, example: ${user-id}.jpg
            mimeType: 'image/jpeg', // The extension of the file
        },
        media: {
            mimeType: 'image/jpeg',
            body: buffer, // Here whe are passing the readed bytes of the image
        },
    });
    console.log('Uploaded succesfully with ID: ', response.data.id)
} catch(error) {
    /* console.log(error.message); */
    console.log('FAILED', error)
}
}

upload();