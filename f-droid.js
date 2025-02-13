import { Builder, Browser, By } from "selenium-webdriver";

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
    } catch (e) {
      ret.codes = ["unknown"];
    }
  }

  // console.log(ret);
  await driver.quit();
  return ret;
};
