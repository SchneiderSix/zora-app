import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(userId);
    if (userId !== "undefined") {
      const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ${userId} ORDER BY p.createdAt DESC`;
      const values = [userId];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    } else {
      const q = `SELECT p.*, users.id AS userId, name, profilePic FROM posts AS p JOIN users ON (users.id = p.userid) WHERE REPLACE(REPLACE(REPLACE(json_extract((SELECT recommendedPostIds FROM users WHERE users.id = ${userInfo.id}), '$[*]'), ',', ']'), ' ', '['), '"', '') LIKE CONCAT('%', CONCAT('[', p.id, ']'), '%') UNION SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ${userInfo.id} OR p.userId = ${userInfo.id} ORDER BY createdAt DESC`;
      const values = [userInfo.id, userInfo.id];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    }
  });
};

export const getAllPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(userId);

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let redo = 0;
    do {
      // min 10000000
      // max 99999999
      var uid = getRandomId(10000000, 99999999);
      let q_id = "SELECT * FROM `posts` WHERE `id`=?";
      db.query(q_id, [+uid], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data) {
          redo = 1;
        } else {
          redo = 0;
        }
      });
    } while (redo == 1);

    const q =
      "INSERT INTO posts(`id`, `desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      uid,
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};

/*Get current feed, help cosine to don't recommend post from current feed*/
export const getFeedFromUser = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT posts.id FROM posts LEFT JOIN relationships AS r ON (posts.userid=r.followedUserId) WHERE r.followerUserId=${userId} OR posts.userid=${userId} ORDER BY posts.createdAt DESC`;
  db.query(q, (err, data) => {
    try {
      const { password, ...info } = data;
      return res.json(info);
    } catch (err) {
      console.log(err);
    }
  });
};

function getRandomId(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export const getFirstQuestions = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  db.query("SELECT * FROM posts WHERE userid=0;", (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const searchEngine = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  const text = req.params.text;
  const q = "SELECT * FROM posts WHERE posts.desc like ?";

  db.query(q, ["%" + text + "%"], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
