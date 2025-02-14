import fs from "fs";

import { getFdroidInfo } from "./f-droid.js";

if (fs.existsSync("apks") === false) {
  fs.mkdirSync("apks");
}
if (fs.existsSync("output.json") === false) {
  fs.writeFileSync("output.json", "[]");
}

fs.readFile("input.json", "utf8", async (err, data) => {
  if (err) {
    throw err;
  }
  const lst = JSON.parse(data);
  console.log("packages:\n", lst);

  /// 并发版本，已弃用，性能需求太大
  // Promise.all(lst.map((packageName) => getFdroidInfo(packageName))).then(
  //   (results) => {
  //     // console.log(results);
  //     fs.writeFile("output.json", JSON.stringify(results, null, 2), (err) => {
  //       if (err) {
  //         throw err;
  //       }
  //       console.log("Results in output.json. Everything is done!");
  //     });
  //   }
  // );

  let results = JSON.parse(fs.readFileSync("output.json", "utf8"));
  for (const packageName of lst) {
    try {
      const result = await getFdroidInfo(packageName);
      results.push(result);
    } catch (e) {
      console.log(`Error when fetching ${packageName}: ${e}`);
    }
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
  }
  console.log("Results in output.json. Everything is done!");
});
