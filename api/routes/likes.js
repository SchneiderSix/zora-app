import express from "express";
import {
  getLikes,
  addLike,
  deleteLike,
  samePostLike,
} from "../controllers/like.js";

const router = express.Router();

router.get("/", getLikes);
router.get("/:usrId/:postId", samePostLike);
router.post("/", addLike);
router.delete("/", deleteLike);

export default router;
