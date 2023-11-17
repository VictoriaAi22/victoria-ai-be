const { Pinecone } = require("@pinecone-database/pinecone");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { WebPDFLoader } = require("langchain/document_loaders/web/pdf");
const { JSONLoader } = require("langchain/document_loaders/fs/json");

const {
  createPineconeIndex,
  updatePinecone,
  queryPineconeVectorStoreAndQueryLLM,
  queryOpenAiToRefineResume,
} = require("./ai.js");
// const { v4 as uuidv4 }=require("uuid");
const { webCrawl } = require("./crawler.js");

async function generateDocuments(req) {
  const documents = [];
  const company_page = [];
  const job_page = [];
  const indexName = "my-index-123";
  const body = req;

  const company_url = body?.company_url;
  const job_listing_url = body?.job_listing_url;
  const document_url = body?.document_url;
  let professionalTitle = "[ Job Title Applying To]";
  try {
    /*----------scrape company_url------------*/

    // if (validateURL(company_url)) {
    //   try {
    //     const limit = 3;
    //     const companyWebsiteContent = await webCrawl(
    //       validateURL(company_url) as string,
    //       limit
    //     );

    //     const jsonString = JSON.stringify(companyWebsiteContent);
    //     const blob = new Blob([jsonString], { type: "application/json" });
    //     const loader = new JSONLoader(blob);
    //     const docs = await loader.load();
    //     documents.push(docs);
    //     console.log(
    //       "------------- companyWebsiteContent docs are ----------------- ",
    //       docs
    //     );
    //   } catch (error) {
    //     console.log("error occured while sraping company_url", error);
    //   }
    // }

    // /*----------scrape job_listing_url------------*/

    if (validateURL(job_listing_url)) {
      try {
        const limit = 1;
        const jobDetail = await webCrawl(validateURL(job_listing_url), 2000);

        if (jobDetail?.error) {
          return jobDetail;
        }

        const jsonString = JSON.stringify(jobDetail);
        const blob = new Blob([jsonString], { type: "application/json" });
        const loader = new JSONLoader(blob);
        const docs = await loader.load();
        // job_page.push(docs);
        const query =
          "extract the job title from this document.extract only the job title, no extra word.i am apply for this job.if you dont know say i dont know.";
        const title = await queryOpenAiToRefineResume(query, docs);
        console.log("title is ", title);

        // Array of phrases to check
        var phrasesToCheck = ["i dont know", "i don't know"];

        // Check if any phrase is present in the sentence
        const found_title = phrasesToCheck.some((phrase) =>
          title?.toLowerCase()?.includes(phrase)
        );
        if (found_title) {
          return {
            error: true,
            message: "failed to scrape",
          };
        }
        professionalTitle = title;
      } catch (error) {
        console.log("error occured while sraping job_listing_url", error);
        return {
          error: true,
          message: "failed to scrape",
        };
      }
    }

    /*----------load resumes------------*/

    // let document_url =
    //   "https://drive.google.com/uc?export=download&id=17plAwqxhHNX2wI2JHkFMfTvcy2-MYpRC";

    console.log("document_url is ", document_url);
    const blob = await fetch(document_url)
      .then(async (response) => await response.blob())

      .catch((error) => {
        console.error("An error occurred while fetching the document:", error);
      });
    console.log("blob is ", blob);

    if (blob instanceof Blob) {
      const loader = new WebPDFLoader(blob);
      const docs = await loader.load();
      documents.push(docs);
    }

    const {
      greeting,
      opener,
      body1,
      body2,
      fullname,
      email,
      phone,
      conclusion,
      call_to_action,
    } = await forCoverLetter(documents);

    const resume = await forResume(documents);

    // console.log({ bio, middle, bottom });
    //await createPineconeIndex(indexName);
    // for (const docs of documents) {
    //   try {
    //     await updatePinecone(indexName, docs);
    //     console.log(`updated pine cone for 1 doc of documents `);
    //   } catch (error) {
    //     console.error(`error updating pincone`, error);
    //   }
    // }
    // const text = await queryPineconeVectorStoreAndQueryLLM(
    //   indexName,
    //   `Refine Shamail Abbas's resume.
    //   emphasize relevant experience and skills for the
    //   job without fabricating anything.
    //   Keep all changes minor
    //   and subtle.
    //   Write professional summary in a brief paragraph form.
    //   include years of experience
    //   include achievements
    //   include Professional career goals,
    //   and keywords used in the job posting.
    //   Provide 2 to 4 bullet points for
    //   each job experience.
    //   Keep skills as simple bullet points. Provide
    //   maximum 12 skills.
    //   Do not change job titles.
    //   Avoid directly mentioning
    //   the company's name and ensure the inclusion of relevant keywords,
    //   when appropriate, for optimal ATS system performance.
    //   Dont say i dont know.`
    // );
    const data = {
      status: 200,
      coverletter: [
        {
          content: null,
          heading: "Dear Hiring Manage",
          sectionTitle: "Sub Header",
          subheading: "[company name]",
        },
        {
          content: null,
          username: fullname,
          professionalTitle: professionalTitle,
          email: email,
          phone: phone,
          sectionTitle: "heading",
          subheading: "",
        },
        {
          content: greeting,
          heading: "",
          sectionTitle: "Greetings",
          subheading: "",
        },
        {
          content: opener,
          heading: "",
          sectionTitle: "Opener",
          subheading: "",
        },
        {
          content: body1,
          heading: "",
          sectionTitle: "Body 1",
          subheading: "",
        },
        {
          content: body2,
          heading: "",
          sectionTitle: "Body 2",
          subheading: "",
        },
        // {
        //   content: contact,
        //   heading: "",
        //   sectionTitle: "",
        //   subheading: "",
        // },
        {
          content: conclusion,
          heading: "",
          sectionTitle: "Conclusion",
          subheading: "",
        },
        {
          content: call_to_action,
          heading: "",
          sectionTitle: "Call to Action",
          subheading: "",
        },
        {
          content: null,
          heading: "",
          sectionTitle: "Signature",
          subheading: "",
        },
      ],
      resume: {
        heading: {
          username: fullname,
          professionalTitle,
          contact: {
            email: email,
            phone: phone,
            socialLinks: resume.socialLinks,
          },
        },
        education: resume.education,
        workExperience: resume.workExperience,
        skills: resume.skills,
        reference: resume.reference,
        professionalSummary: resume.professionalSummary,
        otherSections: {},
      },
    };
    console.log(" data is ", data);
    return data;
  } catch (err) {
    console.log("error: ", err);
    return { status: 500, error: err };
  }
}

function validateURL(url) {
  try {
    const parsedURL = new URL(url);
    console.log("parsed url is ", parsedURL);
    // Check if the URL has a valid domain (hostname)
    if (!parsedURL.hostname) {
      return false;
    }
    // Check if the URL has a valid scheme (http, https,)
    if (["http:", "https:"].includes(parsedURL.protocol) === false) {
      return `https:${parsedURL}`;
    }

    return parsedURL.href;
  } catch (error) {
    console.log(`error validating the ${url} `);
    return false;
  }
}

async function forCoverLetter(documents) {
  const queries = [
    `generate a greeting section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a Opener section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a body paragraph for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a middle paragraph for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `Extract my full name from this document. dont say i dont now.`,
    `Extract my email from this document. dont say i dont now.`,
    `Extract my phone number from this document. dont say i dont now.`,
    `generate a conclusion section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a call to action section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
  ];

  const promises = queries.map(async (query) => {
    try {
      return await queryOpenAiToRefineResume(query, documents[0]);
    } catch (error) {
      // Handle the error here, you can log it or take other actions.
      console.error(`Error in promise: ${error}`);
      return ""; // Return a placeholder value
    }
  });

  const results = await Promise.all(promises);

  return {
    greeting: results[0],
    opener: results[1],
    body1: results[2],
    body2: results[3],
    fullname: results[4],
    email: results[5],
    phone: results[6],
    conclusion: results[7],
    call_to_action: results[8],
  };
}
function parseJson(input, type) {
  try {
    const parsedData = JSON.parse(input);
    if (Object.keys(parsedData[type]).length == 0) return schema[type];
    return parsedData[type];
  } catch (error) {
    console.log("error occured for this ", input);
    return schema[type];
  }
}
// async function forResume(documents) {
//   const education = await queryOpenAiToRefineResume(
//     `Extract   education section in exaclty this format "{"education":{"0":{"school":"Udacity","endYear":"2020","startYear":"2017","achievements":{"0":"list achievements to be in bullet points"},"courseOfStudy":"Full Stack Development"},"1":{"school":"Udacity","endYear":"2020","startYear":"2017","achievements":{"0":"list achievements to be in bullet points"},"courseOfStudy":"Full Stack Development"}}}". include max 3. it should be a valid stringified json . if you dont know just give me the same format with empty strings. don't say i dont know.`,
//     documents[0]
//   );
//   const skills = await queryOpenAiToRefineResume(
//     `Extract   skill section in exaclty this format  "{"skills":{"0":"React","1":"NodeJs"}}" . it should be a valid stringified json . if you dont know just give me the same format with empty strings. don't say i dont know.`,
//     documents[0]
//   );
//   const experience = await queryOpenAiToRefineResume(
//     `Extract   work experience section in exaclty this format "{"workExperience":{"0":{"company":"Company Name","endYear":"End Year(ex. 2018)","jobType":"Full Time, Contract or remote","location":"Company Location","startYear":"Start Year(ex.2017)","achievements":{"0":"list achievements to be in bullet points"}}}}". include max 3. it should be a valid stringified json . if you dont know just give me the same format with empty strings. don't say i dont know.`,
//     documents[0]
//   );
//   const reference = await queryOpenAiToRefineResume(
//     `Extract reference detail in exaclty this format  "{"reference":{"0":{"name":"Referee Name ","contact":"Referee Contact"}}}" . if there is no reference, dont include my information. it should be a valid stringified json . if you dont know just give me the same format with empty strings. don't say i dont know.`,
//     documents[0]
//   );
//   const e = parseJson(education, "education");
//   const f = parseJson(experience, "workExperience");
//   const g = parseJson(skills, "skills");
//   const h = parseJson(reference, "reference");
//   return {
//     education: e,
//     workExperience: f,
//     skills: g,
//     reference: h,
//   };
// }

async function forResume(documents) {
  const queries = [
    {
      label: "education",
      prompt: `Extract education section in exactly this format "{"education":{"0":{"school":"Udacity","endYear":"2020","startYear":"2017","achievements":{"0":"list achievements to be in bullet points"},"courseOfStudy":"Full Stack Development"},"1":{"school":"Udacity","endYear":"2020","startYear":"2017","achievements":{"0":"list achievements to be in bullet points"},"courseOfStudy":"Full Stack Development"}}}" include max 3. it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know."`,
    },
    {
      label: "skills",
      prompt: `Extract skill section in exactly this format "{"skills":{"0":"React","1":"NodeJs"}}" . it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know.`,
    },
    {
      label: "workExperience",
      prompt: `Extract work experience section in exactly this format "{"workExperience":{"0":{"company":"Company Name","endYear":"End Year(ex. 2018)","jobType":"Full Time, Contract or remote","location":"Company Location","startYear":"Start Year(ex.2017)","achievements":{"0":"list achievements to be in bullet points"}}}}". include max 3. it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know.`,
    },
    {
      label: "reference",
      prompt: `Extract reference detail in exactly this format "{"reference":{"0":{"name":"Referee Name ","contact":"Referee Contact"}}}" . if there is no reference, don't include my information. it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know.`,
    },
    {
      label: "socialLinks",
      prompt: `Extract my socialLinks detail in exactly this format "{"socialLinks":{"0":{"github":"https://github.com","facebook":"https://facebook.com","linkedIn":"https://linkedIn.com"}}}" . if there is no reference, don't include my information. it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know.`,
    },
    {
      label: "professionalSummary",
      prompt: `Extract my professionalSummary from this document in 130 words. don't use my name. use I . don't say i don't know.`,
    },
  ];

  // Use Promise.all to run all queries in parallel
  const results = await Promise.all(
    queries.map(async ({ label, prompt }) => {
      const response = await queryOpenAiToRefineResume(prompt, documents[0]);
      if (label == "professionalSummary") return response;
      return parseJson(response, label);
    })
  );

  // Destructure the results array
  const [
    education,
    skills,
    workExperience,
    reference,
    socialLinks,
    professionalSummary,
  ] = results;

  return {
    education,
    workExperience,
    skills,
    reference,
    professionalSummary,
    socialLinks,
  };
}

module.exports = { generateDocuments };

const schema = {
  education: {
    0: {
      school: "your school",
      endYear: "end date",
      startYear: "start date",
      achievements: {
        0: "list achievements to be in bullet points",
      },
      courseOfStudy: " course title",
    },
  },
  workExperience: {
    0: {
      company: "Company Name",
      endYear: "End Year(ex. 2018)",
      jobType: "Full Time, Contract or remote",
      location: "Company Location",
      startYear: "Start Year(ex.2017)",
      achievements: {
        0: "list achievements to be in bullet points",
      },
    },
  },
  otherSections: {},
  skills: {
    0: " your skill",
  },
  reference: {
    0: {
      name: "Referee Name ",
      contact: "Referee Contact",
    },
  },
  socialLinks: {
    0: {
      github: "https://github.com",
      facebook: "https://facebook.com",
      linkedIn: "https://linkedIn.com",
    },
  },
  professionalSummary: "",
};
