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
import generatePublicUrl from '../gcs/index.js';
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

app.post('/api/updateProfile', upload.single('file'), async(req, res) => {
  const file = req.file;
  const userID = req.params.userId;
  console.log('In the route!')
  const q = "SELECT `profilePic` FROM `users` WHERE id = ?"
  db.query(q, [userID], (err, data) => {
    if (err) return res.status(500).json(err);
    // if (data.length) console.log(data);
    console.log('Entered query!');
    res.status(200).json({ 'status': 'OK' });
  })
  // console.log('File received');
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
