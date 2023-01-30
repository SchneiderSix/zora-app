import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });
};

/*Get useres that liked same post*/
export const samePostLike = (req, res) => {
  const usrId = req.params.usrId;
  const postId = req.params.postId;
  const q = `SELECT * FROM posts LEFT JOIN likes ON (posts.id = likes.postId) LEFT JOIN users ON (likes.userId = users.id) WHERE likes.userId!=${usrId} AND likes.postId=${postId} ORDER BY likes.id DESC LIMIT 5;`;

  db.query(q, (err, data) => {
    try {
      const { password, ...info } = data;
      return res.json(info);
    } catch (err) {
      console.log(err);
    }
  });
};

/*Get posts liked by users that liked same post before*/
export const getSamePostLike = (req, res) => {
  const usId = req.params.usId;
  const posId = req.params.posId;
  const q = `SELECT * FROM posts LEFT JOIN likes ON (posts.id = likes.postId) LEFT JOIN users ON (likes.userId = users.id) WHERE likes.userId=${usId} AND likes.postId!=${posId} ORDER BY likes.id DESC LIMIT 3;`;

  db.query(q, (err, data) => {
    try {
      const { password, ...info } = data;
      return res.json(info);
    } catch (err) {
      console.log(err);
    }
  });
};
