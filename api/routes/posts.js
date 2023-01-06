import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  getAllPosts,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/all", getAllPosts);

export default router;
