import express from "express";
import {
  getLikes,
  addLike,
  deleteLike,
  samePostLike,
  samePostDisLike,
  getSamePostLike,
  check,
} from "../controllers/like.js";

const router = express.Router();

router.get("/check-first-questions/:id", check);
router.get("/", getLikes);
router.get("/:usrId/:postId", samePostLike);
router.get("/no/:usId/:posId", samePostDisLike);
router.get("/related/:usId/:posId", getSamePostLike);
router.post("/", addLike);
router.delete("/", deleteLike);

export default router;
