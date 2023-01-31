import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req,res)=>{
    const q = "SELECT userId, yes_no FROM likes WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(like=>[like.userId, like.yes_no]));
    });
}

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    
    db.query("SELECT id, yes_no FROM likes WHERE postId=? AND userId=?", [req.body.postId, userInfo.id], (err, yes_no) => {
      if (err) return res.status(500).json(err);
      let result = Object.values(JSON.parse(JSON.stringify(yes_no)))
      try{
        if (req.body.decision === result[0]['yes_no']){
          del(userInfo.id, req.body.postId)
          return res.status(200).json("Post like has been deleted.");
        }
        else if(req.body.decision !== result[0]['yes_no']){
          //del(userInfo.id, req.body.postId)
          sw(userInfo.id, req.body.postId, req.body.decision)
          return res.status(200).json("Post like has been updated.");
        }
      }
      catch{
        let redo = 0
        do
        {
          // min 10000000
          // max 99999999
          var uid = getRandomId(10000000, 99999999)
          let q_id = "SELECT * FROM `likes` WHERE `id`=?";
          db.query(q_id, [+uid], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data)
            {
              redo = 1;
            }
            else
            {
              redo = 0;
            }
          })
        }while(redo == 1);
    
        const q = "INSERT INTO likes (`id`, `userId`,`postId`, `yes_no`) VALUES (?)";
        const values = [
          uid,
          userInfo.id,
          req.body.postId,
          req.body.decision
        ];

        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Post has been liked.");
        });
      }
    });
  });
};

export const deleteLike = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
    console.log(typeof([userInfo.id, req.query.postId]))
    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been disliked.");
    });
  });
};


function getRandomId(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function sw(uinfo, postid, decision) {
  db.query("UPDATE likes SET yes_no=? WHERE `userId` = ? AND `postId` = ?", [decision, uinfo, postid], (err, data) => {
    if (err) return res.status(500).json(err);
  })
}

function del(uinfo, postid) {
  db.query("DELETE FROM likes WHERE `userId` = ? AND `postId` = ?", [uinfo, postid], (err, data) => {
    if (err) return res.status(500).json(err);
  });
}
