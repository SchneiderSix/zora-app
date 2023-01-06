import express from "express";
import { getUser, updateUser, getUserName } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/find/name/:userName", getUserName);
router.put("/", updateUser);

export default router;
