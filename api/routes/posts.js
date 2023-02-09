import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  getAllPosts,
  getFeedFromUser,
  getFirstQuestions
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/all", getAllPosts);
router.get("/feed/:userId", getFeedFromUser);
router.get("/first-questions", getFirstQuestions)

export default router;
