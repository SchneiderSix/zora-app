import { arrayMoveImmutable } from "array-move";
import langcheck from "langcheck";

const data = {
  Bob: '{"Alice": {"60": "hermosamente bello"}, "Eve": {"8": "la verdad"}, "Charlie": {"24": "tan arrogante"}}',
  Alice:
    '{"Bob": {"100": "me gustan las papitas", "101": "tambien los doritos"}, "Dan": {"61": "dame una moneda"}, "Angelo": {"3": "rico"}}',
  Dan: '{"Alice": {"60": "hermosamente bello"}, "Eve": {"8": "la verdad"}, "Charlie": {"24": "tan arrogante"}}',
  Charlie:
    '{"Bob": {"13": "mucho gusto"}, "Daniel": {"20": "muy correcto", "69": "capo"}, "Dan": {"61": "dame una moneda"}}',
  Daniel:
    '{"Dan": {"61": "dame una moneda"}, "Charlie": {"24": "tan arrogante"}, "Angelo": {"3": "rico"}}',
  Angelo: '{"Alice": {"60": "hermosamente bello"}}',
  Eve: '{"Bob": {"100": "me gustan las papitas", "101": "tambien los doritos"}, "Dan": {"61": "dame una moneda"}}',
  Blocked: '{"Dani"}',
  Liked: '{"100": "me gustan las papitas", "101": "tambien los doritos"}',
};

//Auxiliar function for simple friend block list
const checkList = (mylist, name) => {
  const arr = mylist.split("[").toString().split("]").toString().split('"');
  for (const i of arr) {
    if (i === name) {
      return true;
    }
  }
  return false;
};

const complexFriend = (data) => {
  const user = Object.keys(data)[0];
  const nu = { ...data };
  let block = "";
  let lik = "";
  if (nu["Blocked"]) {
    block = nu["Blocked"];
    delete nu["Blocked"];
  }
  if (nu["Liked"]) {
    lik = nu["Liked"];
    delete nu["Liked"];
  }
  delete nu[user];

  Object.keys(nu).forEach((key) => {
    nu[key] = JSON.parse(nu[key]);
  });

  let recommendedUser = [];
  const recoDict = {};
  const finalResults = {};

  for (let f in nu) {
    for (let f1 in nu[f]) {
      if (!checkList(data[user], f1) && f1 !== user && !checkList(block, f1)) {
        console.log(
          "Author: " +
            f1 +
            " key: " +
            Object.keys(nu[f][f1]) +
            " value: " +
            Object.values(nu[f][f1])
        );
        if (recommendedUser.includes(f1)) {
          if (recommendedUser.indexOf(f1) !== 0)
            recommendedUser = arrayMoveImmutable(
              recommendedUser,
              recommendedUser.indexOf(f1),
              recommendedUser.indexOf(f1) - 1
            );
        } else {
          recommendedUser.push(f1);
        }
        if (!recoDict[f1]) recoDict[f1] = Object.values(nu[f][f1]);
      }
    }
  }
  for (let i in recoDict) {
    for (let j in recoDict[i]) {
      langcheck(recoDict[i][j]).then((v) =>
        v[0] !== undefined ? console.log(v[0]["name"]) : console.log("Unknown")
      );
      console.log(recoDict[i][j]);
      finalResults[i] = {
        posts_comparisons: "val",
        language: "val",
        root_words: "val",
        insults: "val",
        spell_check: "val",
        sentiment: "val",
        about_who: "val",
      };
    }
  }
  console.log(recoDict["Dan"].length);
  console.log(finalResults);
  console.log(finalResults["Dan"]["language"]);
  return recommendedUser;
};

console.log(complexFriend(data));
