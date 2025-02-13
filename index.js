import fs from "fs";

import { getFdroidInfo } from "./f-droid.js";

let lst = [
  "com.sweetiepiggy.everylocale",
  "com.swiss.tournament",
  "com.szchoiceway.aios.bridge",
  "com.tachibana.downloader",
  "com.tjm.crushr",
  "com.trianguloy.isUserAMonkey",
  "com.kunzisoft.keepass.libre",
];

Promise.all(lst.map((packageName) => getFdroidInfo(packageName))).then(
  (results) => {
    // console.log(results);
    fs.writeFile("results.json", JSON.stringify(results, null, 2), (err) => {
      if (err) {
        throw err;
      }
      console.log("Everything is done!");
    });
  }
);