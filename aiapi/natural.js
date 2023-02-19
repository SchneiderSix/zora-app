import { arrayMoveImmutable } from "array-move";
import langcheck from "langcheck";
import natural from "natural";
import nlp from "wink-nlp-utils";
import nlpc from "compromise/three";

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

const realData = {
  123: "Elesh Norn, the Mother of Machines is finally back at the forefront of Magic: The Gathering villainy, as she unleashes her machines in an attempt to rule over the multiverse in Phyrexia: All Will Be One.Yahoo Gaming Southeast Asia talked to Mike Turian, Game Architect, and Mary Katherine Amiotte, Phyrexian Linguist, from Wizards of the Coast to find out more about the background processes that went into designing and bringing back Elesh Norn as well as the plane New Phyrexia.Mike Turian: With Elesh Norn, Grand Cenobite we wanted to introduce her to Magic players showing how powerful and important she was to the Phyrexian cause of spreading their glory to the Multiverse.",
  234: "Tabletop Magic: The Gathering competition has returned for the 2022-2023 season through the Phyrexia Pro Tour, showcasing matches in Phyrexia: All Will Be One Draft and Pioneer Constructed.  Over 250 of the top MTG players from around the globe converged on Philidelphia for the first Pro Tour tournament of the 2022-2023 season. Many of the players earned invites through Regional Championships, along with MTG Arena Weekend Qualifiers. The event took place over the course of three days, with players competing in six total rounds of ONE Draft and up to 10 Swiss rounds of Pioneer Constructed to determine who advanced to the top-eight playoffs on day three.",
  121: "Soul of New Phyrexia Date Reviewed: Feb. 16, 2022Ratings:Constructed: 2.25Casual: 3.75Limited: 4.00Multiplayer: 3.13Commander [EDH]: 3.38Ratings are based on a 1 to 5 scale. 1 is bad. 3 is average. 5 is great.Reviews Below: David FananyPlayer since 1995Instagram '[All] permanents you control' is always an enticing phrase to see on a card; still, I'm not sure a five-mana activated ability on a six-mana creature has ever broken many games open. Soul of New Phyrexia also has a lot of competition in the sort of constructed decks that do have the mana to cast it Primeval Titan literally makes Valakut decks work and doesn't leave much space for anything else, and Tron decks have more proactive colorless options.",
  237: "I haven't logged into Marvel Snap for about a week now — just when the new Quantumania-themed season has begun. Now what, you ask, could be powerful enough to drag me away from a game I have made my ministry since its launch?The big daddy, the OG, the original Magic: The Gathering.Magic's latest set, Phyrexia: All Will Be One, has gotten to me in a way that defies even my expectations. I play paper Magic in casual in person games with friends pretty regularly and have been content with that.",
  213: "Daybreak is promoting new acquisition Magic: The Gathering Online and its latest update, which rolled out last week and includes Phyrexia: All Will Be One, designated as a 'Standard-legal expansion' by Wizards of the Coast. The expansion includes new art bundles, a revamp of the competitive event schedule, improved info in the UI, a refresh of treasure chests, new avatars, and updated monthly rewards.The game's most recent blog post also says the team is working on two-factor authentication.",
  300: "Magic: The Gathering's upcoming crossover set with Lord of the Rings will be launching this June, according to Hasbro's CEO Chris Cocks in a question-and-answer session with investors. Lord of the Rings: Tales of Middle-earth is the first fully-fledged booster product to come out under Magic's Universes Beyond' crossover brand, was previously given a vague 'Q3 2023' date at last year's Wizards Presents. Revealed in the latest Hasbro Investor's Call for Q4 2022, CEO Chris Cocks answered an investor's question regarding the coming year for Magic, and whether it can expect to grow as rapidly as it did previously.",
  303: "Done your Phyrexian language homework? Then you might be interested in the latest Magic: The Gathering keycap set by Clackeys, which covers your keyboard in the metallic monsters' spidery script. The company's selling this set of 116 keycaps, made to tie in with the MTG set Phyrexia All Will Be One, for $125, and expects to deliver them in Q3 2023.  Fortunately, since the Phyrexian alphabet is not super easy to get to grips with (and you'd probably be better off learning a real language anyhow) the regular Latin letters appear alongside the Phyrexian characters.",
  310: 'Principal concept artist Jehan Choo has shared a slew of Magic: The Gathering art on their personal Instagram, featuring compleated Planeswalkers like Ajani as well Norn-controlled Praetors such as Jin-Gitaxias.  The latter came with an interesting tidbit about their design, finally answering the question, "Why did Jin-Gitaxias wear pants?" Choo answered, "We wanted to hide some sign that Norn was commanding all the Praetors, but I felt it was a bit too early to be super obvious with Jin, so he\'s actually hiding his Nornish augment under those swaggy pants.',
  403: "In Magic: The Gathering Arena, sometimes you just want to hit other players hard and fast. No major strategy is involved, just constant, aggressive assaults upon your opponent's life points. While Mono-White Soldiers is fun, Azorius Soldiers (Blue/White) offers far more potential options in gameplay.Unfortunately, Azorius Soldiers didn't really change much from The Brothers War to Phyrexia: All Will Be One. Only one creature was added to most decks in this archetype, and even that one's a little on the contested side: Skrelv, Defector Mite.",
  666: "If you've been following the progression of Magic: The Gatherings card sets and storyline over the last few months, you know that the latest expansion for the world's biggest trading card game left fans on a sour note. Phyrexia: All Will Be One is a major climax for the story that seems to indicate a massive paradigm shift is on the way—in terms of both story, and in-game mechanics.This is Magic: The Gathering's The Empire Strikes Back moment. The bad guys have kicked the good guys' butts across the Multiverse and hope seems to be dead. Sarah Conor",
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
//console.log(complexFriend(data));

const prom = async (re1, re2) => {
  const res1 = re1;
  const res2 = re2;
  await Promise.all([res1, res2]);
};

const complex = async (data) => {
  const Analyzer = natural.SentimentAnalyzer;
  const steemer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", steemer, "afinn");

  const myDict = {};
  for (const [key, value] of Object.entries(data)) {
    if (key !== undefined && value !== undefined) {
      let st = natural.PorterStemmer.tokenizeAndStem(value, true);

      let doc = nlpc(natural.PorterStemmer.stem(value));
      let docStr = doc.people().normalize().text();

      myDict[key] = {
        language: JSON.stringify(await langcheck(value)),
        root_words: natural.PorterStemmer.tokenizeAndStem(value).slice(0, 10),
        insults: "val",
        spell_check: "val",
        sentiment: analyzer.getSentiment(st),
        about_who: docStr, //nlp.string.extractPersonsName("hope seem dead Sarah conor"),
      };
    }
  }
  console.log(myDict);
};

complex(realData);
