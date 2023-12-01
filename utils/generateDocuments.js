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
const convertHtmlToJson = require("./convertHtmlToJson.js");

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
  let jobtitle = body?.jobtitle;
  let job_description = body?.job_description;
  let user_input = body?.notes;

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
          "extract the exact job title from this document. don't add any additional phrase or words.Dont say title is [title] or title in document is [title]. i need just [title]. i am apply for this job.if you dont know say i dont know.";
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

    const coverletter = await forCoverLetter(
      documents,
      user_input,
      option,
      professionalTitle,
      job_description
    );

    const resume = await forResume(documents, job_description);
    console.log(" coverletter is ", coverletter);
    console.log(" resume is ", resume);
    const formatedCoverletter = convertHtmlToJson(coverletter);
    const formatedResume = convertHtmlToJson(resume);
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
          sectionTitle: "Job Title",
          sectionDescription: [professionalTitle],
          bullets: [],
          subSections: [],
        },
        ...formatedCoverletter,
      ],
      resume: formatedResume,
    };

    return data;
  } catch (err) {
    console.log("error: ", err);
    return { status: 500, error: err };
  }
}

function validateURL(url) {
  try {
    const parsedURL = new URL(url);
    //console.log("parsed url is ", parsedURL);
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

async function forCoverLetter(
  documents,
  user_input,
  option,
  professionalTitle,
  job_description
) {
  const prompt = `This document is my resume. make a concise 1-page cover letter using my resume that doesn’t take word for word points from the following job listing. Create cover letter in the format of greeting, opener, body 1, body 2, body 3, conclusion, and a call to action.  I want my cover letter to write a story that cannot be seen on my resume and creates a great first impression. Relate experience from my resume for the job as ${professionalTitle}, at [company name]. ${option} . ${
    user_input && "Also mention that " + user_input
  } .${
    job_description &&
    "Here is the job description, i am applying. " + job_description
  }
  
  ouptput must be exactely in this format
  'Wrap the output in a <body>[whole_output]</body>.
  Each section must be wrapped inside <section>[section]</section>.
  Each section  title must be wrapped inside <h1>[section_title]</h1>.
 If there is any subheading then subheading must be written inside  <h2>[subheadings]</h2>. 
 If there is any paragraph then paragraph must be written inside  <p>[paragraph]</p>.
 If there is any bullet then  bullet must be written inside  <li>/[bullet]</li>. '
  
  Use my details from my resume.
  `;

  try {
    return await queryOpenAiToRefineResume(prompt, documents[0]);
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

async function forResume(documents, job_description) {
  const prompt = `this document is my resume. Refine my resume to emphasize relevant experience and skills for the
  job without fabricating anything. Do not fabricate any of my
  qualifications, experiences, or responsibilities. Keep all changes minor
  and subtle. Write professional summary in a brief paragraph form. In
  my professional summary include: How many years of experience I
  have, my specialty or area where you have the most experience, my
  soft or hard skills that are relevant to the position, any achievements 
  I've accomplished that brought in results, my Professional career goals,
  and keywords used in the job posting. Provide 2 to 4 bullet points for
  each job experience. Keep skills as simple bullet points. Provide
  maximum 12 skills. Do not change job titles. Avoid directly mentioning
  the company's name and ensure the inclusion of relevant keywords,
  when appropriate, for optimal ATS system performance.  
  ${
    job_description &&
    "Here is the job description, i am applying. " + job_description
  } .

  These sections must be included in the resume BioData,Education,WorkExperience,Skills,SocialLink and ProfessionalSummary.
  
  ouptput must be exactely in this format
  'Wrap the output in a <body>[whole_output]</body>.
  Each section must be wrapped inside <section>[section]</section>.
  Each section  title must be wrapped inside <h1>[section_title]</h1>.
 If there is any subheading then subheading must be written inside  <h2>[subheadings]</h2>. 
 If there is any paragraph then paragraph must be written inside  <p>[paragraph]</p>.
 If there is any bullet then  bullet must be written inside  <li>/[bullet]</li>. 
 
 BioData should be in exactly this format 

 <section>
<h1>BioData</h1>
<h2>Name</h2>
<li>[my fullname]</li>
<h2>Contact</h2>
<li>[my contact number]</li>
<h2>Email</h2>
<li>[my email]</li>

</section>


This format should be used for Education and work Experience sections.

'<section>
<h1>Work Experience</h1>
<h2>Full Stack Developer, SageByte, New York (2021 - 2023)</h2>
<li>Developed user-friendly solutions using TypeScript, JavaScript, and Solidity.</li>
<li>Worked with frameworks such as React, Next.js, Node.js, Strapi, Hardhat, and Truffle.</li>

</section>
 '
 This format should be used for SocialLink.

 '<section>
 <h1>Social Link</h1>
 <h2>[plateform name]</h2>
 <li>link here</li> 
 so on and so forth
 
 </section>
  '
  Use my details from my resume.
  `;

  return await queryOpenAiToRefineResume(prompt, documents[0]);
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

[
  {
    sectionTitle: "BioData", //h1 in each section
    sectionDescription: ["paragraph1", "paragraph2", "paragraph3"],
    bullets: ["li 1", "li 2", "li 3", "li 4"],
    subSections: [
      {
        subSectionTitle: "h2 content here",
        bullets: ["li 1", "li 2", "li 3", "li 4"],
      },

      {
        subSectionTitle: "h2 content here",
        bullets: ["li 1", "li 2", "li 3", "li 4"],
      },
    ],
  },
  {
    sectionTitle: "Work Experience", //h1 in each section
    sectionDescription: ["paragraph1", "paragraph2", "paragraph3"],
    bullets: ["li 1", "li 2", "li 3", "li 4"],
    subSections: [
      {
        subSectionTitle: "h2 content here",
        bullets: ["li 1", "li 2", "li 3", "li 4"],
      },

      {
        subSectionTitle: "h2 content here",
        bullets: ["li 1", "li 2", "li 3", "li 4"],
      },
    ],
  },
];
