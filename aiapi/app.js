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

import langcheck from "langcheck";
import natural from "natural";
import nlpc from "compromise/three";
import SpellChecker from "spellchecker";

import BadWordsNext from "bad-words-next";
import en from "bad-words-next/data/en.json" assert { type: "json" };
import es from "bad-words-next/data/es.json" assert { type: "json" };
import fr from "bad-words-next/data/fr.json" assert { type: "json" };
import de from "bad-words-next/data/de.json" assert { type: "json" };
import ru from "bad-words-next/data/ru.json" assert { type: "json" };
import rl from "bad-words-next/data/ru_lat.json" assert { type: "json" };
import ua from "bad-words-next/data/ua.json" assert { type: "json" };
import pl from "bad-words-next/data/pl.json" assert { type: "json" };
import ch from "bad-words-next/data/ch.json" assert { type: "json" };

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

//Mix algorithms
app.post("/mix", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authdata) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const algorithm = req.headers["algorithm"];
      if (algorithm === "cosine") {
        try {
          const words = req.body;
          let base = "";
          let arr = [];
          let strReco = "";

          for (const [key, value] of Object.entries(words)) {
            if (key.startsWith("?")) {
              base = value;
            } else if (key === "Recommended") {
              strReco = value;
              strReco = strReco.substring(1, strReco.length - 1);
            } else {
              arr.push(value);
            }
          }
          Object.keys(words).forEach((item) => {
            if (strReco.includes(item)) {
              arr = arr.filter((ele) => ele !== words[item]);
            }
          });
          const result = cosine(base, arr);
          let ky = Object.keys(words).find((key) => words[key] === result);
          const recommendation = {};
          recommendation[ky] = result;
          res.json({ recommendation });
        } catch (err) {
          res.sendStatus(403);
        }
      } else if (algorithm === "friend") {
        try {
          const recommendation = {};
          recommendation[Object.keys(req.body)[0]] = simpleFriend(req.body);
          res.json({ recommendation });
        } catch (err) {
          res.sendStatus(403);
        }
      } else if (algorithm === "image") {
        try {
          if (Object.values(req.body)[1]) {
            res.sendStatus(403);
          } else {
            downloadImage(Object.values(req.body)[0])
              .then(() => classify("images/test.jpg"))
              .then((val) => {
                let arr = [];
                for (let i of Object.values(val)) {
                  arr.push(i["className"]);
                }
                res.json(arr);
              });
          }
        } catch (err) {
          res.sendStatus(403);
        }
      } else if (algorithm === "complex") {
        try {
          const data = req.body;
          complex(data).then((result) => res.json(result));
        } catch (err) {
          res.sendStatus(403);
        }
      } else {
        res.sendStatus(403);
      }
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
  let user = "";
  for (let i of Object.keys(data)) {
    if (i.startsWith("?")) user = i;
  }
  user = user.substring(1);

  const nu = { ...data };
  let block = "";
  if (nu["Blocked"]) {
    block = nu["Blocked"];
    delete nu["Blocked"];
  }
  delete nu["?" + user];

  //console.log(nu);
  //console.log(data["?" + user]);
  /*Object.keys(nu).forEach((key) => {
    nu[key] = nu[key].split("[").toString().split("]").toString().split('"');
  });*/

  let recommendedUser = [];

  for (let f in nu) {
    for (let f1 in nu[f]) {
      //console.log("User: " + f + " Friend: " + nu[f][f1]);
      for (let i of data["?" + user]) {
        if (i === nu[f][f1]) console.log("in original user friend");
      }
      if (
        !checkList(data["?" + user], nu[f][f1]) &&
        nu[f][f1] !== user &&
        !checkList(block, nu[f][f1])
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
  for (let i of data["?" + user]) {
    if (recommendedUser.includes(i)) recommendedUser.pop(i);
  }
  //console.log("Reco: " + recommendedUser);
  return recommendedUser;
};

//Auxiliar function for simple friend block list
const checkList = (mylist, name) => {
  for (let i of mylist) {
    if (i === name) {
      return true;
    }
  }
  return false;
};

//Clasify image
const classify = async (imagePath) => {
  try {
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
  } catch (err) {
    return false;
  }
};

//Download img from internet
const downloadImage = async (url) => {
  try {
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
  } catch (err) {
    return false;
  }
};

//Complex data
const complex = async (data) => {
  const remv = (str) => {
    let res = "";
    for (let i of str.split(" ")) {
      if (!res.includes(i)) res += i + ", ";
    }
    return res.substring(0, res.length - 2);
  };
  const Analyzer = natural.SentimentAnalyzer;
  const steemer = natural.PorterStemmer;

  const myDict = {};
  for (const [key, value] of Object.entries(data)) {
    if (key !== undefined && value !== undefined) {
      // Languague
      let lan = JSON.stringify(await langcheck(value));
      lan = lan.substring(10, 12);
      //Sentiment
      if (lan === "en") {
        var analyzer = new Analyzer("English", steemer, "afinn");
      } else if (lan === "es") {
        var analyzer = new Analyzer("Spanish", steemer, "afinn");
      } else if (lan === "ja") {
        var analyzer = new Analyzer("Japanese", steemer, "afinn");
      } else if (lan === "fr") {
        var analyzer = new Analyzer("French", steemer, "afinn");
      } else if (lan === "pt") {
        var analyzer = new Analyzer("Portuguese", steemer, "afinn");
      } else if (lan === "it") {
        var analyzer = new Analyzer("Italian", steemer, "afinn");
      } else if (lan === "ru") {
        var analyzer = new Analyzer("Russian", steemer, "afinn");
      } else if (lan === "de") {
        var analyzer = new Analyzer("German", steemer, "afinn");
      } else if (lan === "fi") {
        var analyzer = new Analyzer("Finnish", steemer, "afinn");
      } else if (lan === "ar") {
        var analyzer = new Analyzer("Arabic", steemer, "afinn");
      } else if (lan === "el") {
        var analyzer = new Analyzer("Greek", steemer, "afinn");
      } else {
        var analyzer = new Analyzer("English", steemer, "afinn");
      }
      let st = natural.PorterStemmer.tokenizeAndStem(value, true);
      //Who
      let doc = nlpc(natural.PorterStemmer.stem(value));
      let docStr = doc.people().normalize().text();
      docStr = remv(docStr);

      //Bad words
      var badwords = new BadWordsNext();
      badwords.add(en);
      badwords.add(es);
      badwords.add(fr);
      badwords.add(de);
      badwords.add(ru);
      badwords.add(rl);
      badwords.add(ua);
      badwords.add(pl);
      badwords.add(ch);
      let bv = badwords.filter(value);
      let counter = 0;
      for (let i of bv.split(" ")) {
        if (i === "***") counter++;
      }

      //Check spelling
      let spl =
        lan === "en"
          ? SpellChecker.getCorrectionsForMisspelling(value)
          : "Only for English";

      myDict[key] = {
        language: lan,
        root_words: natural.PorterStemmer.tokenizeAndStem(value).slice(0, 10),
        insults: counter,
        spell_check: spl,
        sentiment: analyzer.getSentiment(st),
        about_who: docStr,
      };
    }
  }
  return myDict;
};

app.listen(4000, function () {
  console.log("listening ...");
});
