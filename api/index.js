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
import pkg from '../gcs/index.js';

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

app.post('/api/uploadImage', upload.single('file'), (req, res) => {
  try {
    const response = uploadAuth(req.file, `test-${Date.now()}`, mime.getType(req.file));
    res.json({ 'status':  response.status, 'fileURL': `https://drive.google.com/uc?export=view&id=${response.fileId}`});
    console.log('Success!');
    console.log(response.ext);
  } catch (err) {
    res.json({ 'status': 'BAD REQUEST', 'fileURL': null })
    console.log("THE ERROR: ", err);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.listen(8800, () => {
  console.log("API working!");
});
