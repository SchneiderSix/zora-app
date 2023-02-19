import express from "express";
import {
  getUser,
  updateUser,
  getUserName,
  getUserFriends,
  recommendPost,
  recommendedFriend,
  getLastFiveUserFriends,
  aiDice,
  aiSimpleFriend,
  getRecommendedFriends,
  aiComplex,
  aiImage,
} from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/find/name/:userName", getUserName);
router.get("/find/friends/:userId", getUserFriends);
router.get("/find/friends/reco/:userId", getRecommendedFriends);
router.get("/five/:userId", getLastFiveUserFriends);
router.put("/", updateUser);
router.put("/reco/post/:userId/:postId", recommendPost);
router.put("/reco/friend/:userId/:friendId", recommendedFriend);
router.post("/", aiDice);
router.post("/simple", aiSimpleFriend);
router.post("/imgclassification", aiImage);
router.post("/complex", aiComplex);

export default router;
