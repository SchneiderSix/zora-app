import express from "express";
import {
  getUser,
  updateUser,
  getUserName,
  getUserFriends,
  recommendPost,
  aiDice,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/find/name/:userName", getUserName);
router.get("/find/friends/:userId", getUserFriends);
router.put("/", updateUser);
router.put("/reco/post/:userId/:postId", recommendPost);
router.post("/", aiDice);

export default router;
