const axios = require("axios");
const { convert } = require("html-to-text");

async function webCrawl(url, token_limit) {
  try {
    const pageHTML = await fetchPageHTML(url);
    if (pageHTML?.error) {
      throw new Error("Failed to scrape");
    }

    const options = {
      preserveNewlines: true,
    };

    const textContent = await convert(pageHTML, options);

    return {
      textContent: textContent
        .replace(/\n/g, "")
        .replace(/\s+/g, " ")
        .replace(/\b(?:https?|ftp):\/\/\S+/gi, "")
        .split(" ")
        .slice(0, token_limit)
        .join(" "),
    };
  } catch (error) {
    console.error(`Error in webCrawl: ${error.message}`);
    return {
      error: true,
      message: "Failed to scrape",
    };
  }
}

async function fetchPageHTML(url) {
  try {
    const response = await axios.get(url, { maxRedirects: 0 });
    return response.data;
  } catch (error) {
    console.error(`Error fetching page ${url}: ${error.message}`);
    if (
      error.response &&
      (error.response.status === 301 || error.response.status === 302)
    ) {
      const redirectUrl = error.response.headers.location;
      console.log(`Redirecting to ${redirectUrl}`);
      return fetchPageHTML(redirectUrl);
    } else {
      throw { error: true, message: "Failed to scrape" };
    }
  }
}

module.exports = { webCrawl };
