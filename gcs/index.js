// Some imports
import { google } from "googleapis";
// import * as path from 'path';
// import * as fs from 'fs';
import fs from "fs";
import pkg from "googleapis/build/src/apis/index.js";
const { file } = pkg;
import mime from "mime";
import { Stream } from "stream";

async function generatePublicUrl(fileId) {
  try {
    const CLIENT_ID =
      "838279513253-tf0vb120mogiegp7tkp5147f09mgadhl.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//04CfJp5cK3XjiCgYIARAAGAQSNwF-L9IrbdKoKzsBrYD7ONfCTTGxCadVr36JNLIdRyrfqx_HgAHIgiN9kDDfNvvOEIZE_EzF51w";
    // Using the credentials to authenticate in Google API
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    //Last auth step
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // Setting Drive API
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    //console.log(result.data.webViewLink);
    const toParse = result.data.webViewLink.split("/");
    //console.log(toParse[5]);
    const fullLink = "https://drive.google.com/uc?id=" + toParse[5]; // Concatenating the default share link with the File ID to the get link to paste in the HTML
    return { status: "OK", viewLink: fullLink };
  } catch (error) {
    return { status: "FAILED" };
  }
}

export async function updatePfp(fileId, filePath, delFile, fileType) {
  const CLIENT_ID =
    "838279513253-tf0vb120mogiegp7tkp5147f09mgadhl.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04CfJp5cK3XjiCgYIARAAGAQSNwF-L9IrbdKoKzsBrYD7ONfCTTGxCadVr36JNLIdRyrfqx_HgAHIgiN9kDDfNvvOEIZE_EzF51w";
  // Using the credentials to authenticate in Google API
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  //Last auth step
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // Setting Drive API
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  //console.log("-------------------FILE ID----------------: ", fileId);
  if (delFile) {
    const response = await drive.files.delete({
      fileId: fileId,
    });
  }
  try {
    const buffer = fs.createReadStream(`../client/public/upload/${filePath}`);
    const myResponse = await drive.files.create({
      requestBody: {
        name: filePath,
        mimeType: fileType,
        //parents: pFolder,
      },
      media: {
        mimeType: fileType,
        body: buffer,
      },
    });
    const urlResp = await generatePublicUrl(myResponse.data.id);
    if (urlResp.status === "FAILED") {
      return { status: "FAILED" };
    }
    return {
      status: "OK",
      fileURL: urlResp.viewLink,
      ext: mime.getExtension(file),
    };
  } catch (error) {
    console.log(error);
    return { status: "FAILED", fileId: null, ext: null, error: error };
  }
}

export default async function uploadAuth(filePath, fileType) {
  const CLIENT_ID =
    "838279513253-tf0vb120mogiegp7tkp5147f09mgadhl.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground";
  const REFRESH_TOKEN =
    "1//04CfJp5cK3XjiCgYIARAAGAQSNwF-L9IrbdKoKzsBrYD7ONfCTTGxCadVr36JNLIdRyrfqx_HgAHIgiN9kDDfNvvOEIZE_EzF51w";
  // Using the credentials to authenticate in Google API
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  //Last auth step
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // Setting Drive API
  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });
  try {
    const buffer = fs.createReadStream(`../client/public/upload/${filePath}`);
    const response = await drive.files.create({
      requestBody: {
        name: filePath, // Here goes the filename that will be uploaded, example: ${user-id}.jpg
        mimeType: fileType, // The extension of the file
      },
      media: {
        mimeType: fileType,
        body: buffer, // Here whe are passing the readed bytes of the image
      },
    });
    // console.log(response.data);
    const result = await drive.permissions.create({
      resource: {
        type: 'anyone',
        role: 'reader'
      },
      fileId: response.data.id,
      fields: 'id'
    })
    //console.log(result);
    //const urlResp = await generatePublicUrl(response.data.id);
    return {
      status: "OK",
      fileURL: `https://drive.google.com/uc?id=${response.data.id}`,
      ext: mime.getExtension(file),
    };
    // Here we have to store 'response.data.id' in the DB to store the Image ID
  } catch (error) {
    /* console.log(error.message); */
    return { status: "FAILED", fileId: null, ext: null };
  }
}

/*generatePublicUrl();
console.log(myLink);*/
