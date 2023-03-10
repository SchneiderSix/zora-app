import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK USER IF EXISTS

  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");
    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    let redo = 0;
    do {
      // min 10000000
      // max 99999999
      var uid = getRandomId(10000000, 99999999);
      let q_id = "SELECT * FROM `users` WHERE `id`=?";
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
      "INSERT INTO users (`id`, `username`,`email`,`password`,`name`,`recommendedPostIds`,`recommendedFriendIds`,`blocked`) VALUE (?)";

    const values = [
      uid,
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
      /*Set empty array for "recommendedPostIds" and "recommendedFriendIds". Needed to append ids*/
      "[]",
      "[]",
      "[]",
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

async function authSocket() {
  const response = await fetch('http://localhost:5500', {
    method: 'POST'
  });
  console.log(response);
  return 'OK';
}

export const login = async (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  authSocket();
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};

function getRandomId(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
