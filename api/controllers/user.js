import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import qs from "qs";
import axios from "axios";

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

//Get last five friends from specific user
export const getLastFiveUserFriends = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT users.id, name FROM users LEFT JOIN relationships AS r ON (users.id = r.followedUserId) WHERE r.followerUserId=? ORDER BY users.id DESC LIMIT 5`;

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data;
    return res.json(info);
  });
};

//Get recommended friends
export const getRecommendedFriends = (req, res) => {
  const userId = req.params.userId;
  const q = `select users.id, users.name, users.profilePic from users where REPLACE(REPLACE(REPLACE(json_extract((SELECT recommendedFriendIds FROM users WHERE users.id = ${userId}), '$[*]'), ',', ']'), ' ', '['), '"', '') LIKE CONCAT('%', CONCAT('[', users.id, ']'), '%') and users.id not in (SELECT users.id from users left join relationships as r on (users.id=r.followedUserId) WHERE r.followerUserId=${userId})`;
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

/*Insert recommendedFriendIds into "recommendedFriendIds"*/
export const recommendedFriend = (req, res) => {
  const userId = req.params.userId;
  const friendId = req.params.friendId;
  /*Add recommendedPostId as string (because JSON_SEARCH can search strings not ints and that function is needed to delete specific id from list with many ids) or delete it from array*/
  const q = `UPDATE users SET recommendedFriendIds = CASE WHEN JSON_CONTAINS((select recommendedFriendIds FROM (SELECT recommendedFriendIds FROM users WHERE users.id = ${userId}) AS reco), '["${friendId}"]') = 0 THEN JSON_ARRAY_APPEND(recommendedFriendIds, '$', "${friendId}") WHEN JSON_LENGTH(recommendedFriendIds) = 1 THEN JSON_REMOVE(recommendedFriendIds, '$[0]') ELSE JSON_REMOVE(recommendedFriendIds, REPLACE(JSON_SEARCH(recommendedFriendIds, "one", ${friendId}), '"', '')) END WHERE users.id = ${userId}`;

  db.query(q, (err, data) => {
    try {
      const { password, ...info } = data;
      return res.json(info);
    } catch (err) {
      //console.log(err);
    }
  });
};

/*Insert users into "blocked"*/
export const blockUser = (req, res) => {
  const userId = req.params.userId;
  const blockId = req.params.blockId;
  /*Add recommendedPostId as string (because JSON_SEARCH can search strings not ints and that function is needed to delete specific id from list with many ids) or delete it from array*/
  const q = `UPDATE users SET blocked = CASE WHEN JSON_CONTAINS((select blocked FROM (SELECT blocked FROM users WHERE users.id = ${userId}) AS reco), '["${blockId}"]') = 0 THEN JSON_ARRAY_APPEND(blocked, '$', "${blockId}") WHEN JSON_LENGTH(blocked) = 1 THEN JSON_REMOVE(blocked, '$[0]') ELSE JSON_REMOVE(blocked, REPLACE(JSON_SEARCH(blocked, "one", ${blockId}), '"', '')) END WHERE users.id = ${userId}`;

  db.query(q, (err, data) => {
    try {
      const { password, ...info } = data;
      return res.json(info);
    } catch (err) {
      //console.log(err);
    }
  });
};

//Get blocked users
export const getBlockedUsers = (req, res) => {
  const userId = req.params.userId;
  const q = `select users.id from users where REPLACE(REPLACE(REPLACE(json_extract((SELECT blocked FROM users WHERE users.id = ${userId}), '$[*]'), ',', ']'), ' ', '['), '"', '') LIKE CONCAT('%', CONCAT('[', users.id, ']'), '%')`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data;
    return res.json(info);
  });
};

//Call AI API for cosine
export const aiDice = async (req, res) => {
  let dict = req.body;
  const urlv = "http://localhost:4000/mix";

  var data = qs.stringify(dict);
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: urlv,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJpZCI6MSwibmFtZSI6IkpvaG4iLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifSwiaWF0IjoxNjc2NTUzMDA5fQ.xBM4eR37VXw4iBXNTwDgSteetLTGRvIx43Hj7jCt0Ws`,
      algorithm: "cosine",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return res.status(200).send(response.data);
  } catch (e) {
    console.log(e);
  }
};

//Call AI API for simpleFriend
export const aiSimpleFriend = async (req, res) => {
  let dict = req.body;
  const urlv = "http://localhost:4000/mix";

  var data = qs.stringify(dict);
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: urlv,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJpZCI6MSwibmFtZSI6IkpvaG4iLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifSwiaWF0IjoxNjc2NTUzMDA5fQ.xBM4eR37VXw4iBXNTwDgSteetLTGRvIx43Hj7jCt0Ws`,
      algorithm: "friend",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return res.status(200).send(response.data);
  } catch (e) {
    console.log(e);
  }
};

//Call AI API for complex
export const aiComplex = async (req, res) => {
  let dict = req.body;
  const urlv = "http://localhost:4000/mix";

  var data = qs.stringify(dict);
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: urlv,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJpZCI6MSwibmFtZSI6IkpvaG4iLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifSwiaWF0IjoxNjc2NTUzMDA5fQ.xBM4eR37VXw4iBXNTwDgSteetLTGRvIx43Hj7jCt0Ws`,
      algorithm: "complex",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    return res.status(200).send(response.data);
  } catch (e) {
    console.log(e);
  }
};

//Call AI API for img classification
export const aiImage = async (req, res) => {
  let dict = req.body;
  const urlv = "http://localhost:4000/mix";

  var data = qs.stringify(dict);
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: urlv,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJpZCI6MSwibmFtZSI6IkpvaG4iLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifSwiaWF0IjoxNjc2NTUzMDA5fQ.xBM4eR37VXw4iBXNTwDgSteetLTGRvIx43Hj7jCt0Ws`,
      algorithm: "image",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    return res.status(200).send(response.data);
  } catch (e) {
    console.log(e);
  }
};
