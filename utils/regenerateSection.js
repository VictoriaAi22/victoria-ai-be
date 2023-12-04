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

async function regenerateSection(req) {
  const documents = [];
  const company_page = [];
  const job_page = [];
  const indexName = "my-index-123";
  const body = req;

  const company_url = body?.company_url;
  const job_listing_url = body?.job_listing_url;
  const document_url = body?.document_url;
  let professionalTitle = "[ Job Title Applying To]";
  let jobtitle = body?.jobtitle;
  let job_description = body?.job_description;
  let user_input = body?.notes;
  const section = body?.section;
  const document_type = body?.document_type;
  if (!section || !document_type) return;

  let option;
  if (body?.option == 1) {
    option = `Relate experience from my resume for the job position I am applying to. Chose skills or traits the employer is requiring to 
    demonstrate I meet and exceed the requirements. Ensure the inclusion of relevant keywords, when appropriate, for optimal ATS system performance
    `;
  }
  if (body?.option == 2) {
    option = `Acknowledge that I am entering the work force after finishing my degree but my previous job experience applies to the skills 
    and requirements used at this job. ensure the inclusion of relevant keywords, when 
    appropriate, for optimal ATS system performance
    `;
  }
  if (body?.option == 3) {
    option = `Acknowledge that I am changing career fields but my previous job experience applies to the skills and requirements used 
    at this job. ensure the inclusion of relevant keywords, when appropriate, for optimal 
    ATS system performance
     `;
  }

  if (body?.jobtitle) {
    professionalTitle = body.jobtitle;
  }

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

    if (!body?.jobtitle && validateURL(job_listing_url)) {
      try {
        const limit = 1;
        const jobDetail = await webCrawl(validateURL(job_listing_url), 1000);

        if (jobDetail?.error) {
          return jobDetail;
        }

        const jsonString = JSON.stringify(jobDetail);
        const blob = new Blob([jsonString], { type: "application/json" });
        const loader = new JSONLoader(blob);
        const docs = await loader.load();
        // job_page.push(docs);
        const query =
          "extract the job title from this document.extract only the job title. dont add any additional words.i am apply for this job.if you dont know say i dont know.";
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

    let data;
    if (document_type == "coverletter")
      data = await forCoverLetter(documents, user_input, option, section);
    if (document_type == "resume") data = await forResume(documents, section);

    console.log(" data is ", data);
    return {
      status: 200,
      [section]: data,
    };
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

async function forCoverLetter(documents, user_input, option, section) {
  const queries = [
    {
      label: "greeting",
      prompt: `generate a greeting section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now. dont include greeting or salutions at the start or end becuase this section will be followed by other sections`,
    },
    {
      label: "opener",
      prompt: `generate a Opener section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.dont include greeting or salutions at the start or end becuase this section will be followed by other sections. dont introduce me again as introduction is already done.`,
    },
    {
      label: "body_1",
      prompt: `generate a body paragraph for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.dont include greeting or salutions at the start or end becuase this section will be followed by other sections. dont introduce me again as introduction is already done. ${option}`,
    },
    {
      label: "body_2",
      prompt: `generate a middle paragraph for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont know. Demonstrate an understanding in the company's mission and culture.  Relate experiences or skills from my resume for key words used in the job position requirements. ensure the inclusion of relevant keywords, when appropriate, for optimal ATS system performance.`,
    },
    {
      label: "fullname",
      prompt: `Extract my full name from this document.dont add any additional words. dont say i dont now.`,
    },
    {
      label: "email",
      prompt: `Extract my email from this document.dont add any additional words. dont say i dont now.`,
    },
    {
      label: "phone",
      prompt: `Extract my phone number from this document.dont add any additional words. dont say i dont now.`,
    },
    {
      label: "conclusion",
      prompt: `generate a conclusion section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont know. Conclude with a succinct summary of my strengths from my resume and show interest in the company. ${user_input}`,
    },

    {
      label: "call_to_action",
      prompt: `generate a call to action section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    },
  ];

  const _section = queries.find((i) => i.label == section);
  console.log("_section is ", _section);
  try {
    return await queryOpenAiToRefineResume(_section.prompt, documents[0]);
  } catch (error) {
    // Handle the error here, you can log it or take other actions.
    console.error(`Error in promise: ${error}`);
    return ""; // Return a placeholder value
  }
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

async function forResume(documents, section) {
  const queries = [
    {
      label: "education",
      prompt: `Extract education section in exactly this format "{"education":{"0":{"school":"Udacity","endYear":"2020","startYear":"2017","achievements":{"0":"list achievements to be in bullet points"},"courseOfStudy":"Full Stack Development"},"1":{"school":"Udacity","endYear":"2020","startYear":"2017","achievements":{"0":"list achievements to be in bullet points"},"courseOfStudy":"Full Stack Development"}}}" . include maximum 3. it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know."`,
    },
    {
      label: "skills",
      prompt: `Extract skill section in exactly this format "{"skills":{"0":"React","1":"NodeJs"}}" . it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know. Refine my skills from my resume to emphasize relevant 12 skills for the job without fabricating any skills. Keep skills as simple bullet points. Keep all changes minor and subtle. ensure the inclusion of relevant keywords, when appropriate, for optimal ATS system performance.`,
    },
    {
      label: "workExperience",
      prompt: `Extract work experience section in exactly this format "{"workExperience":{"0":{"company":"Company Name","endYear":"End Year(ex. 2018)","jobType":"Full Time, Contract or remote","location":"Company Location","startYear":"Start Year(ex.2017)","achievements":{"0":"list achievements to be in bullet points"}}}}". include max 3. it should be a valid stringified json. if you don't know just give me the same format with empty strings. don't say i don't know. Refine my previous work experience from my resume to emphasize relevant experience and skills for the job without fabricating anything. Do not fabricate any of my qualifications, experiences, or responsibilities. Keep all changes minor and subtle. State 3-4 bullet points for each job experience. ensure the inclusion of relevant keywords, when appropriate, for optimal ATS system performance. Do not fabricate any 
      responsibilities or experience
      `,
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
      prompt: `Extract my professionalSummary from this document in 130 words. don't use my name. use I . don't say i don't know. Write professional summary in a brief 
      paragraph form. In my professional summary include: How many years of experience I 
      have, my specialty or area where you have the most experience, my soft or hard skills 
      that are relevant to the position, any achievements I've accomplished that brought 
      in results, my Professional career goals, and keywords used in the job posting. Avoid 
      directly mentioning the company's name and ensure the inclusion of relevant keywords, 
      when appropriate, for optimal ATS system performance.
      `,
    },
  ];

  // Use Promise.all to run all queries in parallel
  const _section = queries.find((i) => i.label == section);
  console.log("_section is ", _section);
  const response = await queryOpenAiToRefineResume(
    _section.prompt,
    documents[0]
  );
  if (_section.label == "professionalSummary") return response;
  return parseJson(response, _section.label);
}

module.exports = { regenerateSection };

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