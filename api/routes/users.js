import express from "express";
import {
  getUser,
  updateUser,
  getUserName,
  getUserFriends,
  recommendPost,
<<<<<<< HEAD
=======
  recommendedFriend,
  getLastFiveUserFriends,
  aiDice,
  aiSimpleFriend,
  getRecommendedFriends,
>>>>>>> 7246a6221abb4dcfcbf7797a24fa8162379db7d6
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

export default router;
