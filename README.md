<h1 align="center">F-Droid-Auto</h1>

<p align="center">
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/TwinklerG/F-Droid-Auto">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/TwinklerG/F-Droid-Auto">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/TwinklerG/F-Droid-Auto">
</p>

这是一个Selenium应用，自动化地，根据F-Droid应用包名，获取其相关信息，包括应用名称、应用概述、APK下载链接、编程语言等，并尝试下载APK。

## 使用说明

### Step1 配置环境

配置[selenium的Node.js环境配置](https://www.selenium.dev/zh-cn/documentation/webdriver/getting_started/install_library/)

下载安装chromedriver到环境变量

### Step2 配置包名

配置`input.json`，为一个包含所有所需应用包名的数组

### Step3 启动[^1]

```shell
node index.js
```

最终结果在`output.json`中，下载的APK在`apks`目录下

[^1]: 由于axios库对于代理支持不好，请使用TUN模式或全局代理
