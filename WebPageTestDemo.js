const WebPageTest = require("webpagetest");
const wpt = new WebPageTest("www.sitespeed.io");

wpt.runTest("https://docs.webpagetest.org/api/integrations/", (err, data) => {
  console.log(err || data);
});