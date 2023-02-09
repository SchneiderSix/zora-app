// Some imports
import { google } from 'googleapis';
// import * as path from 'path';
// import * as fs from 'fs';
import fs from 'fs';
import pkg from 'googleapis/build/src/apis/index.js';
const { file } = pkg;
import mime from 'mime';
import { Stream } from 'stream';

export default async function uploadAuth(file, filename, fileType) {
    // Getting the env variables
   /*  const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN; */
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
    try {
        const openFile = fs.createReadStream(file);
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname, // Here goes the filename that will be uploaded, example: ${user-id}.jpg
                mimeType: file.mimeType, // The extension of the file
            },
            media: {
                mimeType: file.mimeType,
                body: /*fs.createReadStream(file)*/ openFile, // Here whe are passing the readed bytes of the image
            },
        });
        // console.log(response.data);
        return {'status': 'OK', 'fileId': response.data.id, 'ext': mime.getExtension(file)}
        // Here we have to store 'response.data.id' in the DB to store the Image ID
    } catch(error) {
        /* console.log(error.message); */
        throw error;
    }
}

// const filepath = path.join(__dirname, 'path/to/the/file'); // In this case, we have to indicate the file passed via the HTML Form
// const readStream = fs.createReadStream(filepath); // Reading the bytes of the file

// Try to upload a file to google drive

/*uploadFile();*/

// async function generatePublicUrl() {
//     try {
//         const fileId = 'FILE_ID_HERE'; // The File ID stored in the DB

//         await drive.permissions.create({
//             fileId: fileId,
//             requestBody: {
//                 role: 'reader',
//                 type: 'anyone',
//             },
//         });

//         const result = await drive.files.get({
//             fileId: fileId,
//             fields: 'webViewLink, webContentLink',
//         });
//         console.log(result.data.webViewLink);
//         const toParse = result.data.webViewLink.split('/');
//         console.log(toParse[5]);
//         const fullLink = 'https://drive.google.com/uc?export=view&id=' + toParse[5]; // Concatenating the default share link with the File ID to the get link to paste in the HTML
//         console.log(fullLink);

//     } catch(error) {
//         console.log(error.message);
//     }
// }

/*generatePublicUrl();
console.log(myLink);*/

