const cheerio = require("cheerio");

function convertHtmlToJson(html) {
  try {
    const $ = cheerio.load(html);
    const output = [];

    $("section").each((index, section) => {
      const sectionTitle = $("h1", section).text().trim();
      const sectionDescription = $("p", section).text().trim();
      const bullets = [];
      const subSections = [];

      let currentH2 = null;

      $("h2, li", section).each((subIndex, element) => {
        const tagName = $(element).prop("tagName").toLowerCase();
        const text = $(element).text().trim();

        if (tagName === "h2") {
          currentH2 = text;
          subSections.push({
            subSectionTitle: text,
            bullets: [],
          });
        } else if (tagName === "li") {
          if (currentH2) {
            const subSection = subSections.find(
              (sub) => sub.subSectionTitle === currentH2
            );
            if (subSection) {
              subSection.bullets.push(text);
            }
          } else {
            bullets.push(text);
          }
        }
      });

      const sectionObject = {
        sectionTitle,
        sectionDescription: sectionDescription ? [sectionDescription] : [],
        bullets,
        subSections,
      };

      output.push(sectionObject);
    });

    console.log(output);
    return output;
  } catch (error) {
    throw new Error();
  }
}

module.exports = convertHtmlToJson;
