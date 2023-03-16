const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const {URL} = require('url');

/**
  * 登录前准备工作，创建浏览器和页面
  *
  * @param {RunOptions} runOptions
  */
const prepare = async (runOptions) => {
  // puppeteer 启动的配置项
  const launchOptions = {
    headless: true, // 是否无头模式
    defaultViewport: { width: 1440, height: 960 }, // 指定打开页面的宽高
    // 浏览器实例的参数配置，具体配置可以参考此链接：https://peter.sh/experiments/chromium-command-line-switches/
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: '/usr/bin/chromium-browser', // 默认 Chromium 执行的路径，此路径指的是服务器上 Chromium 安装的位置
  };
  // 服务器上运行时使用服务器上独立安装的 Chromium
  // 本地运行的时候使用 node_modules 中的 Chromium
  if (process.env.NODE_ENV === 'development') {
    delete launchOptions.executablePath;
  }
  // 创建浏览器对象
  const browser = await puppeteer.launch(launchOptions);
  // 获取浏览器对象的默认第一个标签页
  const page = (await browser.pages())[0];
  // 返回浏览器和页面对象
  return { browser, page };
}

(async() => {
  const url = 'https://chromestatus.com/features';
  
  // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  
  // Wait for Lighthouse to open url, then inject our stylesheet.
  browser.on('targetchanged', async target => {
    const page = await target.page();
    if (page && page.url() === url) {
      await page.addStyleTag({content: '* {color: red}'});
    }
  });
  
  // Lighthouse will open the URL.
  // Puppeteer will observe `targetchanged` and inject our stylesheet.
  const {lhr} = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'json',
    logLevel: 'info',
  });
  
  console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
  
  await browser.close();
  })();
