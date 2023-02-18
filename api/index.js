import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import uploadAuth from '../gcs/index.js';
// import generatePublicUrl from '../gcs/index.js';
import { updatePfp } from "../gcs/index.js";
import fs from 'fs';
import { db } from "./connect.js";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post('/api/uploadImage', upload.single("file"), async(req, res) => {
  const file = req.file;
  // console.log(file.filename);
  const response = await uploadAuth(file.filename, file.mimetype);
  if (response.status === 'FAILED') {
    fs.unlink(`../client/public/upload/${file.filename}`, function (err) {
      if (err) {
        // console.log('Couldnt remove file!');
      } else {
        // console.log('File deleted')
      }
    });
    res.status(400).json({'status': 'UPLOAD FAILED'});
  } else {
    // console.log('Uploaded!');
    // console.log(response.fileURL);
    fs.unlink(`../client/public/upload/${file.filename}`, function (err) {
      if (err) {
        // console.log('Couldnt remove file!');
      } else {
        // console.log('File deleted')
      }
    });
    res.status(200).json({'status': 'OK', 'imgLink': response.fileURL});
  }
});


async function uploadPfp(driveData, fileName, deleteFile, fileType) {
  console.log('DRIVEDATA ---------------------- ', driveData);
  const response = await updatePfp(driveData, fileName, deleteFile, fileType);
  if (response.status === 'FAILED') return ({'status': 'FAILED'});
  return ({'status': 'OK', 'imgUrl': response.fileURL})

}

app.post('/api/updateProfile/:userId', upload.single('file'), async(req, res) => {
  const file = req.file;
  const userID = req.params.userId;
  const fileType = req.query.fileType;
  let profData;
  let folderId;
  let driveData;
  let fileId;
  let q;
  if (fileType === 'pfp')
  {
    q  = "SELECT `profilePic` FROM `users` WHERE `id` = ?";
  } else {
    q = "SELECT `coverPic` FROM `users` WHERE `id` = ?";
  }
  db.query(q, [userID], (err, data) => {
    if (err) return res.status(500).json(err);
    let deleteFile;
    profData = data;
    if (fileType === 'pfp')
    {
      driveData = JSON.stringify(data[0].profilePic);
      let test = driveData.split('=');
      fileId = test[2].substring(0, test[2].length-1);
      console.log('MY FILE ID --------------------: ', fileId);
      if (fileId === '1K9q6MdmJwRB5SCZDbWuWJwaaU1Tq7y70') {
        deleteFile = false;
      } else {
        deleteFile = true;
      }
      
    } else {
      driveData = JSON.stringify(data[0].coverPic);
      let test = driveData.split('=');
      fileId = test[2].substring(0, test[2].length-1);
      console.log('MY FILE ID: ........-.-.-.-.--.-', fileId);
      if (fileId === '1cQxbAQhRTxYT4vzBzE2T84eOk-fIAQep') {
        deleteFile = false;
      } else {
        deleteFile = true;
      }
    }
    function deleteLocalfile() {
      fs.unlink(`../client/public/upload/${file.filename}`, function (error) {
        if (error) 
        {
          console.log(error);
          return false;
        }
        console.log('delete succesful')
        return true
      });
    };
    console.log(`File ID: ${fileId}\nFolder ID: ${folderId}\nDelete file?: ${deleteFile}\nFile type: ${fileType}`);
    uploadPfp(fileId, file.filename, deleteFile, file.mimetype).then(response => {
      console.log(response);
      if (!deleteLocalfile) res.status(500).json({'status': 'DELETE FAILED'});
      if (response.status === 'FAILED') res.status(500).json({'status': 'FAILED'});
      res.status(200).json({'status': 'OK', 'imgURL': response.imgUrl});
    });
});
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.listen(8800, () => {
  console.log("API working!");
});
