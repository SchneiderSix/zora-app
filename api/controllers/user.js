import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const getUserName = (req, res) => {
  const userName = req.params.userName;
  const q = `SELECT * FROM users WHERE name=?`;

  db.query(q, [userName], (err, data) => {
    try {
      const { password, ...info } = data[0];
      return res.json(info);
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};

export const getUserFriends = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT users.id, name, profilePic FROM users LEFT JOIN relationships AS r ON (users.id = r.followedUserId) WHERE r.followerUserId=?`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data;
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.coverPic,
        req.body.profilePic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

/*Insert recommendedPostId into "recommendedPostIds"*/
export const recommendPost = (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  /*Add recommendedPostId as string (because JSON_SEARCH can search strings not ints and that function is needed to delete specific id from list with many ids) or delete it from array*/
  const q = `UPDATE users SET recommendedPostIds = CASE WHEN JSON_CONTAINS((select recommendedPostIds FROM (SELECT recommendedPostIds FROM users WHERE users.id = ${userId}) AS reco), '["${postId}"]') = 0 THEN JSON_ARRAY_APPEND(recommendedPostIds, '$', "${postId}") WHEN JSON_LENGTH(recommendedPostIds) = 1 THEN JSON_REMOVE(recommendedPostIds, '$[0]') ELSE JSON_REMOVE(recommendedPostIds, REPLACE(JSON_SEARCH(recommendedPostIds, "one", ${postId}), '"', '')) END WHERE users.id = ${userId}`;

  db.query(q, (err, data) => {
    try {
      const { password, ...info } = data;
      return res.json(info);
    } catch (err) {
      console.log(err);
    }
  });
};
