import { arrayMoveImmutable } from "array-move";

const data = {
  Bob: ["Alice", "Eve", "Charlie"],
  Alice: ["Bob", "Dan", "Angelo"],
  Dan: ["Alice", "Eve", "Charlie"],
  Charlie: ["Bob", "Daniel", "Dan"],
  Daniel: ["Dan", "Charlie", "Angelo"],
  Angelo: ["Alice"],
  Eve: ["Bob", "Dan"],
};
console.log(data);
const user = Object.keys(data)[0];
const nu = { ...data };
delete nu[user];
const friendsUser = [];
let recommendedUser = [];

console.log("-Bob friends: " + data[user]);
for (let f in nu) {
  if (data[user].includes(f)) {
    console.log("+User friend: " + f);
    friendsUser.push(f);
  }
  for (let f1 in nu[f]) {
    console.log("Friends from " + f + ": " + nu[f][f1]);
    if (!data[user].includes(nu[f][f1]) && nu[f][f1] !== user) {
      if (recommendedUser.includes(nu[f][f1])) {
        if (recommendedUser.indexOf(nu[f][f1]) !== 0)
          recommendedUser = arrayMoveImmutable(
            recommendedUser,
            recommendedUser.indexOf(nu[f][f1]),
            recommendedUser.indexOf(nu[f][f1]) - 1
          );
        console.log("\tRecommend " + nu[f][f1] + " to " + user);
      } else {
        recommendedUser.push(nu[f][f1]);
      }
    }
  }
}
console.log(friendsUser);
console.log("Recommendation:\t" + recommendedUser);
