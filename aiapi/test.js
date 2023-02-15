import axios from "axios";
import qs from "qs";

let urlm = "http://localhost:3000/maketok";
let urlv = "http://localhost:3000/mix";

var data = qs.stringify({
  123: '"Tessemae\'s joins Good Day DC to share some Super Bowl menu inspiration from chicken bacon ranch pull apart rolls to grilled chorizo nachos."',
  452: "\"Carne asada and frijoles charros are the main dish at outdoor, sunset parties in the northeast region of the country. Some people call them 'cowboy beans' or '\\nFrijoles Charros\\n' on this American side of the border, but believe me, the Mexican recipe is a little different.\\nCharro Beans\\nIn Mexico, a carne asada party only takes a couple of phone calls from relatives, friends or '\\ncompadres\\n' to organize a plan to see who will bring the steaks, drinks, salsas, guacamole, tortillas, onions and the pot of frijoles charros.\"",
  653: "\"Get ready folks — Valentine's Day is just a week away.\\n \\nIf you haven't had the time plan your perfect date night, it's time to put on your rose-tinted glasses and get your partner swooning with romantic deals, sip-worthy drinks and limited time specials.\\n \\nFor the ladies celebrating Galentine's Day instead — there's much in store too!\\n \\nNew Sippers at Tippling Club\\n \\n \\nAs Tippling Club's Head Bartender Arathorn Grey takes to the passage, he presents a brand new menu: A Guide to Modern Drinking, Volume III — 6 Decades of Music.\"",
  321: '"Chef Matt Healy is known for three things, his beard, his tattoos and MasterChef: The Professionals 2016 in which he was runner-up. There is a fourth, by his own admission, his ego.\\n\\nIt was MasterChef that catapulted Healy to fame if not necessarily fortune. Never mind that he once served the judges insects or, horror of horrors, put Yorkshire pudding alongside roast chicken, but it was his red wine sauce which Marcus Wareing declared the best sauce he\'d ever tasted in the MasterChef kitchen, that propelled him into the final."',
  666: '"The Geneva Commons location is the second Hacienda Real Flavors of Mexico in the Chicagoland area — its sister space is in Yorkville.\\n\\nGENEVA, IL — Geneva Commons is home to a new restaurant serving innovative Mexican cuisine and inventive cocktails.\\n\\nOfficially opened Feb. 5, Hacienda Real Flavors of Mexico has begun its operations with a \\"soft opening\\" phase, welcoming customers on a first-come, first-served basis. The restaurant is expected to begin accepting reservations in a few weeks, mall executives said."',
  782: '"Looking for the best vegan restaurants in Phoenix? Travel Noire\'s got you covered for the Super Bowl and beyond!\\nAre you going to enjoy the Super Bowl in Arizona and looking for plant-based dining alternatives? Travel Noire has compiled this list of the top vegan restaurants in Phoenix, Arizona, based on the highest scores generated from Vegan community reviews on the Internet.\\nWith these delicious vegan alternatives, even the carnivores should agree that these restaurants would satisfy even the most fastidious palette."',
  333: "\"From decked-out dogs to spruced-up sausages, Peoria's \\nDog Haus Biergarten\\n is ready to welcome customers.\\nVarious delays forced the planned 2022 opening to be \\npushed back\\n. Even so, the Metro Centre's Eric Brinker said, 'It certainly is going to be worth the wait.'\\nIf you are looking to visit, here are some things you need to know about Dog Haus Biergarten.\\nMore:\\nLong-awaited eatery to open soon in Peoria with 'unique twist' on American classics\\nWays to connect with Dog Haus\\nWhere is it? \\nDog Haus Biergarten is located at 4712 N.\"",
  334: "With the latest Magic: The Gathering  set,  Phyrexia All Will Be One , the fate of the Multiverse is in grave danger. Elesh Norn, the leader of the Phyrexians, has set her sights on all living beings, hoping to corrupt and spread the influence of Phyrexia until All Will Be One. Wizards of the Coast sent us along a brand new packaged bundle for the game, Phyrexia: All Will Be One Bundle: Compleat Edition , and we're embracing the cold wisdom of Phyrexia with our first look and unboxing! What's Included In The Phyrexia All Will Be One Bundle: Compleat Edition ? The Phyrexia: All Will Be One Bundle: Compleat Edition  contains a treasure trove of limited edition goodies for  MTG  fans looking to jump into the new set.",
  335: "After our brief dalliance into the past with The Brothers' War, Magic: The Gathering Arena has decided to take the fight straight to the Phyrexians, with a plunge into the machine hells of Phyrexia: All Will Be One. With oil, poison, and compleated Planeswalkers everywhere, All Will Be One is a brutal set full of surprises. Some of those surprises can be found in the Mastery Pass, which gives you dozens of rewards simply for playing the game. Here's everything you need to know about both the free and paid tracks, and how best to make the most of your time in the Fair Basilica.",
  336: "Wizards of the Coast today released Phyrexia: All Will Be One , the latest set for the world's oldest and best trading card game, Magic: The Gathering . The third instalment to the four-part Phyrexian storyline, Phyrexia: All Will Be One will see players experience the beauty and horror of the Phyrexians as Magic's oldest, most memorable villains, pursue their plans to take over the multiverse. The set contains 271 cards and is available to play on Arena and tabletop today. For thousands of years, Phyrexians have sought to dominate other worlds by propagating their viral gift and turning every living thing into a biomechanical horror.",
  337: "Melbourne Magic: The Gathering fans with surface area to spare, this one's for you! Wizards of the Coast/MtG and killer Melbourne tattoo studio, Yokai City Tattoo, are joining forces to ink up dedicated players with some gorgeous-looking pieces for a special Phyrexia: All Will Be One flash day, to celebrate the launch of the new set. You can head over to the studio's Instagram to check out some of the available designs and get in touch with one of the artists to ensure you snag a booking for the event, which is going down this Saturday, February 11th: After our heroes revisit the past in The Brothers' War, their attention must turn to the growing threat in front of them with Phyrexia: All Will Be One—and they won't all make it out unscathed—or unchanged.",
  338: "Magic: The Gathering Phyrexia: All Will Be One is one of the most exciting sets to drop from Wizards of the Coast in some time, and the Compleat Edition is the ultimate Phyrexia bundle, so it stands to reason that fans might have trouble getting their hands on it. Fortunately, the Compleat Edition was available to pre-order at the standard $79.99 price at the time of writing if you know where to look. Currently, the Phyrexia: All Will Be One MTG Compleat set is available to pre-order here at Entertainment Earth (free US shipping using the code FREESHIP39 at checkout during the month of February plus their mint condition guarantee for collectors) and here at Walmart with a release date set for early March.",
  339: "If you'd like to get extra rewards while playing normally, then the Mastery Pass may be for you. There are two tiers in the Mastery Pass, a free tier with a few rewards, and a paid tier that's filled to the brim with exclusive rewards. Mastery Passes are essentially battle passes, allowing you to climb tiers by gaining XP. Each set, they focus on a different theme, and this Mastery Pass centers around the haunting creatures known as Phyrexians. Here's our take on whether the Phyrexia: All Will Be One Mastery Pass is worth buying on MTG Arena.",
  340: "Elesh Norn, the Mother of Machines is finally back at the forefront of Magic: The Gathering villainy, as she unleashes her machines in an attempt to rule over the multiverse in Phyrexia: All Will Be One. Yahoo Gaming Southeast Asia talked to Mike Turian, Game Architect, and Mary Katherine Amiotte, Phyrexian Linguist, from Wizards of the Coast to find out more about the background processes that went into designing and bringing back Elesh Norn as well as the plane New Phyrexia. Mike Turian: With Elesh Norn, Grand Cenobite we wanted to introduce her to Magic players showing how powerful and important she was to the Phyrexian cause of spreading their glory to the Multiverse.",
  500: "It's been a good start to 2023 for Magic: The Gathering fans, thanks to the fantastic release of Dominaria Remastered , and now we're already about to get the second release of the year when Phyrexia: All Will Be One releases on February 10th. Phyrexia is going to be quite a departure from the remaster of the iconic Dominaria plane, and instead we'll be getting some very evil machines that have a disturbing desire for domination. There are a lot of very cool (and unsettling) cards in the set, that should shakeup decks in multiple formats.",
  501: "Despite claims online that say otherwise, Magic: The Gathering's newest foil treatment won't come off just by lightly rubbing on the card with your finger. For Phyrexia: All Will Be One, Wizards of the Coast debuted ‘Step-and-Compleat' foiling. This treatment mimics the step-and-repeat backdrops used at fashion shows and red carpets, repeating the Phyrexian emblem across the card. It looks great, and cards using it are often the most valuable cards in the set, however, there have been concerns that it is incredibly prone to damage.",
  "?": "Phyrexia: All Will Be One is one of the most visually-stunning sets in Magic: The Gathering. It explores the Phyrexian race, a group of beings led by a dangerous woman with a shared desire to absorb every world and make all of them one with Phyrexia. This guide covers the 10 most expensive cards from Phyrexia: All Will Be One, so you know what to look out for when opening packs. We've built this list based on the value of cards from the Phyrexia: All Will Be One main set on Cardmarket , one of the largest collectible and competitive card game resale sites available.",
  504: "I haven't logged into Marvel Snap for about a week now — just when the new Quantumania -themed season has begun. Now what, you ask, could be powerful enough to drag me away from a game I have made my ministry since its launch? The big daddy, the OG, the original Magic: The Gathering . Magic 's latest set, Phyrexia: All Will Be One , has gotten to me in a way that defies even my expectations. I play paper Magic in casual in-person games with friends pretty regularly and have been content with that.",
  505: "MTG Arena has remained a reference in the collectible card game segment for some time, in part thanks to the constant support it receives with updates and new content. However, new versions do not always bring only good things, since sometimes they are full of issues. For instance, the ‘SNC' update caused an annoying crashing issue or an ‘Asset error detected' message. Now, it seems that a new version is producing a similar situation. More specifically, MTG Arena is crashing again after the ‘Phyrexia: All Will Be One' update.",
  Recommended: '["336"]',
});

axios
  .post(urlm)
  .then(function (response) {
    const tok = response.data["token"];
    console.log(response.data);
    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: urlv,
      headers: {
        Authorization: `Bearer ${tok}`,
        algorithm: "cosine",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  .catch(function (err) {
    console.log(err);
  });
