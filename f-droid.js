import axios from "axios";
import { Builder, Browser, By } from "selenium-webdriver";
import fs from "fs";
import { URL } from "url";

export const getFdroidInfo = async (packageName) => {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  await driver.get(`https://f-droid.org/zh_Hans/packages/${packageName}/`);

  let ret = {};

  let title = await driver.findElement(By.className("package-name"));
  ret.title = await title.getText();

  let summary = await driver.findElement(By.className("package-summary"));
  ret.summary = await summary.getText();

  let download = await driver.findElement(By.id("latest"));
  download = await download.findElement(
    By.className("package-version-download")
  );
  download = await download.findElement(By.linkText("下载 APK"));
  ret.apk_download_url = await download.getAttribute("href");

  try {
    console.log("Downloading:", ret.apk_download_url);
    const filePath =
      "apks/" + URL.parse(ret.apk_download_url).pathname.split("/").pop();
    let response = await axios({
      url: ret.apk_download_url,
      method: "GET",
      responseType: "stream",
      timeout: 10000, // 10s
      headers: { "User-Agent": "Node.js" }, // 可选请求头
    });
    if (
      fs.existsSync(filePath) &&
      fs.readFileSync(filePath).length === Number(response.headers["content-length"])
    ) {
      console.log(`${filePath} already exists.`);
    } else {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      console.log(`Downloaded to ${filePath}`);
    }
  } catch (e) {
    console.log("Download apk Error:", e);
  }

  let code_source = await driver.findElement(By.linkText("源代码"));
  ret.code_source_url = await code_source.getAttribute("href");

  let src_host = URL.parse(ret.code_source_url).hostname;
  if (src_host === "github.com") {
    await driver.get(ret.code_source_url);
    try {
      let container = await driver.findElement(
        By.id("repo-content-pjax-container")
      );
      let containers = await container.findElements(By.className("d-inline"));
      ret.codes = [];
      for (let ct of containers) {
        let code = await ct.findElement(
          By.className("color-fg-default text-bold mr-1")
        );
        ret.codes.push(await code.getText());
      }
    } catch {
      ret.codes = ["unknown"];
    }
  }

  // console.log(ret);
  await driver.quit();
  return ret;
};
