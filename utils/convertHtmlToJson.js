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
      let currentSubSection = null;

      $("h2, li, institute, startdate, enddate", section).each(
        (subIndex, element) => {
          const tagName = $(element).prop("tagName").toLowerCase();
          const text = $(element).text().trim();

          if (tagName === "h2") {
            currentH2 = text;
            currentSubSection = {
              subSectionTitle: text,
              bullets: [],
              institute: null,
              startdate: null,
              enddate: null,
            };
            subSections.push(currentSubSection);
          } else if (tagName === "li") {
            if (currentSubSection) {
              currentSubSection.bullets.push(text);
            } else {
              bullets.push(text);
            }
          } else if (
            (tagName === "institute" ||
              tagName === "startdate" ||
              tagName === "enddate") &&
            (sectionTitle === "Education" || sectionTitle === "Work Experience")
          ) {
            currentSubSection[tagName] = text;
          }
        }
      );

      const sectionObject = {
        sectionTitle,
        sectionDescription: sectionDescription ? [sectionDescription] : [],
        bullets,
        subSections,
      };

      output.push(sectionObject);
    });
    output.forEach((section) => {
      if (
        !section.sectionTitle.toLowerCase().includes("education") &&
        !section.sectionTitle.toLowerCase().includes("work experience") &&
        section.subSections
      ) {
        section.subSections.forEach((subSection) => {
          // Remove unwanted properties
          delete subSection?.institute;
          delete subSection?.startdate;
          delete subSection?.enddate;
        });
      }
    });

    return output;
  } catch (error) {
    throw new Error();
  }
}

module.exports = convertHtmlToJson;
