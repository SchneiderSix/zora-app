import express from "express";
import jwt from "jsonwebtoken";
import bp from "body-parser";
import axios from "axios";
import stringSimilarity from "string-similarity";
import { arrayMoveImmutable } from "array-move";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tfnode from "@tensorflow/tfjs-node";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";

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
  jwt.sign({ users }, "secretKey" /*, { expiresIn: "30s" }*/, (err, token) => {
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
      const words = req.body;
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
      const recommendation = {};
      recommendation[ky] = result;
      res.json({ recommendation });
    }
  });
});

//Route simple friend, first key is the original user
app.post("/friend", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const recommendation = {};
      recommendation[Object.keys(req.body)[0]] = simpleFriend(req.body);
      res.json({ recommendation });
    }
  });
});

//Route predict given image
app.post("/image", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      downloadImage(Object.values(req.body)[0])
        .then(() => classify("images/test.jpg"))
        .then((val) => {
          res.json(val);
        });
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

//Simple friend
const simpleFriend = (data) => {
  const user = Object.keys(data)[0];
  const nu = { ...data };
  let block = "";
  if (nu["Blocked"]) {
    block = nu["Blocked"];
    delete nu["Blocked"];
  }
  console.log(block);
  delete nu[user];

  Object.keys(nu).forEach((key) => {
    nu[key] = nu[key].split("[").toString().split("]").toString().split('"');
  });

  let recommendedUser = [];

  for (let f in nu) {
    for (let f1 in nu[f]) {
      if (
        !data[user].includes(nu[f][f1]) &&
        nu[f][f1] !== user &&
        !block.includes(nu[f][f1])
      ) {
        if (recommendedUser.includes(nu[f][f1])) {
          if (recommendedUser.indexOf(nu[f][f1]) !== 0)
            recommendedUser = arrayMoveImmutable(
              recommendedUser,
              recommendedUser.indexOf(nu[f][f1]),
              recommendedUser.indexOf(nu[f][f1]) - 1
            );
        } else {
          recommendedUser.push(nu[f][f1]);
        }
      }
    }
  }
  return recommendedUser;
};

//Clasify image
const classify = async (imagePath) => {
  const image = fs.readFileSync(imagePath);
  const decodedImage = tfnode.node.decodeImage(image, 3);

  const model = await mobilenet.load();
  const predictions = await model.classify(decodedImage);
  fs.unlink("images/" + "test.jpg", (err) => {
    if (err) {
      throw err;
    }
    console.log("Delete File successfully.");
  });
  return predictions;
};

//Download img from internet
const downloadImage = async (url) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const defPath = path.resolve(__dirname, "images", "test.jpg");
  const writer = fs.createWriteStream(defPath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

app.listen(3000, function () {
  console.log("listening ...");
});
