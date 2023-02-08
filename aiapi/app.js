const express = require("express");
const jwt = require("jsonwebtoken");
const bp = require("body-parser");
const stringSimilarity = require("string-similarity");

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  const users = {
    id: 1,
    name: "John",
    email: "john@example.com",
  };
  res.json(users);
});

//Create Token
app.post("/maketok", (req, res) => {
  const users = {
    id: 1,
    name: "John",
    email: "john@example.com",
  };
  jwt.sign({ users }, "secretKey", { expiresIn: "30s" }, (err, token) => {
    res.json({ token });
  });
});

//Verify token
app.post("/verifytok", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "Verified token", authData });
    }
  });
});

//Route cosine simmilarity with given dictionary, the key of original post starts with '?'
app.post("/cosine", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const words = req.query;
      let base = "";
      const arr = [];
      for (const [key, value] of Object.entries(words)) {
        if (key.startsWith("?")) {
          base = value;
        } else {
          arr.push(value);
        }
      }
      const result = cosine(base, arr);
      let ky = Object.keys(words).find((key) => words[key] === result);
      if (ky.startsWith("?")) ky = ky.replace("?", "");
      const recommendation = {};
      recommendation[ky] = result;
      res.json({ recommendation });
    }
  });
});

//Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

//Cosine
const cosine = (txt, arr) => {
  const matches = stringSimilarity.findBestMatch(txt, arr);
  return matches["bestMatch"]["target"];
};

app.listen(3000, function () {
  console.log("listening ...");
});
