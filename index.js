const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const config = require('./config');

const TestResult = [];


/**
 * @description 创建lighthouse测量实例
 */
const createLighthouseInstance = async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--window-size=1920,1080'] });
  const runnerResult = await lighthouse('https://tiger.tianyancha.com/company/19009957', { port: chrome.port }, config);

  const reportJson = runnerResult.report;
  fs.writeFileSync('lhreportJSON.json', reportJson);

  // console.log('Report is done for', runnerResult.lhr.finalUrl);

  const result = {
    'FCP': runnerResult.lhr?.audits['first-contentful-paint']?.numericValue.toFixed(1),
    'LCP': runnerResult.lhr?.audits['largest-contentful-paint']?.numericValue.toFixed(1),
    'TBT': runnerResult.lhr?.audits['total-blocking-time']?.displayValue,
    'TTI': runnerResult.lhr?.audits['interactive']?.displayValue,
    'SpeedIndex': runnerResult.lhr?.audits['speed-index']?.displayValue,
    'CLS': runnerResult.lhr?.audits['cumulative-layout-shift']?.displayValue,
  }
  TestResult.push(result);
  await chrome.kill();
}


/**
 * @description 执行测量函数，串行执行
 * @param time 测量次数
 */
const execute = async (time) => {
  for (let i = 0; i < time; i++) {
    try {
      await createLighthouseInstance();
    } catch (e) {
      console.log(e)
    }
  }
  console.log(TestResult);
  // console.log(CaculateAverage(TestResult))
}


execute(5);

/**
 * @description 计算多次测量后各指标的平均值
 * @param arr 需要计算平均值的原始数组
 */
function CaculateAverage(arr) {
  const FCPSum = arr.reduce((pre, cur) => parseFloat(cur.FCP) + pre, 0);
  const LCPSum = arr.reduce((pre, cur) => parseFloat(cur.LCP) + pre, 0);
  const TBTSum = arr.reduce((pre, cur) => parseFloat(cur.TBT) + pre, 0);
  const TTISum = arr.reduce((pre, cur) => parseFloat(cur.TTI) + pre, 0);
  const SpeedIndexSum = arr.reduce((pre, cur) => parseFloat(cur.SpeedIndex) + pre, 0);
  const CLSSum = arr.reduce((pre, cur) => parseFloat(cur.CLS) + pre, 0);
  return {
    FCPAve: (FCPSum / arr.length).toFixed(1),
    LCPAve: (LCPSum / arr.length).toFixed(1),
    TBTAve: (TBTSum / arr.length).toFixed(1),
    TTIAve: (TTISum / arr.length).toFixed(1),
    SpeedIndexAve: (SpeedIndexSum / arr.length).toFixed(1),
    CLSAve: (CLSSum / arr.length).toFixed(3),
  }
}







