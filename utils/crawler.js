const axios = require("axios");
const cheerio = require("cheerio");
const { convert } = require("html-to-text");

async function webCrawl(url, limit) {
  const crawledURLs = await crawl(url, limit);
  const textContents = await extractTextContent(crawledURLs);
  return textContents;
}

async function crawl(url, limit) {
  const visitedURLs = new Set();
  const queue = [url];
  const crawledURLs = [];

  while (queue.length > 0 && crawledURLs.length < limit) {
    const currentURL = queue.shift();

    if (!visitedURLs.has(currentURL)) {
      visitedURLs.add(currentURL);
      const pageHTML = await fetchPageHTML(currentURL);
      if (pageHTML) {
        crawledURLs.push(currentURL);
        const relativeURLs = extractRelativeURLs(pageHTML, currentURL);
        queue.push(...relativeURLs);
      }
    }
  }

  return crawledURLs;
}

async function extractTextContent(urls) {
  let textContents = {
    textContent: "",
  };

  for (const url of urls) {
    const pageHTML = await fetchPageHTML(url);
    if (pageHTML) {
      const options = {
        preserveNewlines: true,
        // ...
      };

      const textContent = await convert(pageHTML, options);
      textContents = { textContent: textContents.textContent + textContent };
    }
  }

  return textContents;
}

async function fetchPageHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${url}: ${error.message}`);
    return null;
  }
}

function extractRelativeURLs(html, baseURL) {
  const $ = cheerio.load(html);
  const relativeURLs = [];

  $("a").each((index, element) => {
    const href = $(element).attr("href");
    if (href && href.startsWith("/")) {
      const absoluteURL = new URL(href, baseURL).toString();
      relativeURLs.push(absoluteURL);
    }
  });

  return relativeURLs;
}
module.exports = { webCrawl };
