'use strict';
const config = {
  extends: 'lighthouse:default',
  settings: {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    formFactor: 'desktop',
    disableStorageReset: false, // 禁止在运行前清除浏览器缓存和其他存储API
    throttling: {
      cpuSlowdownMultiplier: 0, // 控制仿真+模拟的CPU节流
      rttMs: 35,  //控制仿真网络往返时延（TCP层）
      throughputKbps: 12000, //控制仿真网络下载吞吐量1000M
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false
    },
    audits: [
      'first-contentful-paint',
      'byte-efficiency/uses-optimized-images',
    ],
    passes:[ {
      passName: 'fastPass',
      gatherers: ['fast-gatherer'],
      useThrottling: false,
    },],
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
    skipAudits: ['uses-http2'], //devtoolsLogs gatherer, required by audit uses-http2, did not run
  },
};

module.exports = config;
