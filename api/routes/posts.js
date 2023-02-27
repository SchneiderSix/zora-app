import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  getAllPosts,
  getFeedFromUser,
  getFirstQuestions,
  searchEngine,
  getLast10Posts,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/all", getAllPosts);
router.get("/feed/:userId", getFeedFromUser);
router.get("/first-questions", getFirstQuestions);
router.get("/search/:text", searchEngine);
router.get("/last/:userId", getLast10Posts);

export default router;
