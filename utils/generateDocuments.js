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
  const indexName = "my-index-123";
  const body = req;

  const company_url = body?.company_url;
  const job_listing_url = body?.job_listing_url;
  const document_url = body?.document_url;

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

    // if (validateURL(job_listing_url)) {
    //   try {
    //     const limit = 1;
    //     const jobDetail = await webCrawl(
    //       validateURL(job_listing_url) as string,
    //       limit
    //     );

    //     const jsonString = JSON.stringify(jobDetail);
    //     const blob = new Blob([jsonString], { type: "application/json" });
    //     const loader = new JSONLoader(blob);
    //     const docs = await loader.load();
    //     documents.push(docs);
    //     console.log("------------- jobDetail docs are ----------------- ", docs);
    //   } catch (error) {
    //     console.log("error occured while sraping job_listing_url", error);
    //   }
    // }

    /*----------load resumes------------*/

    // const fileUrl =
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
      //console.log("resume docs are ", docs);
    }

    // const contact = await getFormatedResponse(
    //   "Extract about  contact section for a cover letter from this document",
    //   documents[0],
    //   contactSchema
    // );
    // const about = await getFormatedResponse(
    //   "Extract about section for a cover letter from this document",
    //   documents[0],
    //   aboutSchema
    // );
    // const education = await getFormatedResponse(
    //   "Extract about  education section for a cover letter from this document",
    //   documents[0],
    //   educationSchema
    // );
    // const skills = await getFormatedResponse(
    //   "Extract about  skills section for a cover letter from this document",
    //   documents[0],
    //   skillSchema
    // );
    // const experience = await getFormatedResponse(
    //   "Extract about  experience section for a cover letter from this document",
    //   documents[0],
    //   experienceSchema
    // );

    // const conclusion = await getFormatedResponse(
    //   "Extract about  conclusion section for a cover letter from this document",
    //   documents[0],
    //   conclusionSchema
    // );

    const {
      greeting,
      opener,
      body1,
      body2,
      contact,
      conclusion,
      call_to_action,
    } = await forCoverLetter(documents);

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
          heading: "[First & Last Name], [ Job Title Applying To]",
          sectionTitle: "Header / Contact Info",
          subheading: "[phone number] — [email]",
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

function parseJson(input) {
  try {
    if (input instanceof Object) {
      return input;
    }
    return JSON.parse(input);
  } catch (error) {
    console.log("error occured for this ", input);
    return {};
  }
}

async function forCoverLetter(documents) {
  const queries = [
    `generate a greeting section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a Opener section for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a body paragraph for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `generate a middle paragraph for a cover letter from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    `Extract contact section from this document. give name , phone and email in a json format. Don't use \n as line breaker. dont say i dont now.`,
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
    contact: results[4],
    conclusion: results[5],
    call_to_action: results[6],
  };
}

async function forResume(documents) {
  const about = await queryOpenAiToRefineResume(
    `Extract   about section from this document. Dont use he , use I. Don't use \n as line breaker. dont say i dont now.`,
    documents[0]
  );
  const education = await queryOpenAiToRefineResume(
    `Extract   education section in bullets with course name and course duration from this document. Don't include my name or I. Don't use \n as line breaker. dont say i dont now.`,
    documents[0]
  );
  const skills = await queryOpenAiToRefineResume(
    `Extract   skill section from this document. each skill should be separated by | Don't use \n as line breaker. dont say i dont now.`,
    documents[0]
  );
  const experience = await queryOpenAiToRefineResume(
    `Extract   work experience section in bullets with job name and course duration from this document. Don't include my name or I.  Don't use \n as line breaker. dont say i dont now.`,
    documents[0]
  );
  const contact = await queryOpenAiToRefineResume(
    `Extract contact section from this document. give name , phone and email in a json format. Don't use \n as line breaker. dont say i dont now.`,
    documents[0]
  );
  const conclusion = await queryOpenAiToRefineResume(
    `Extract   conclusion section from this document. Dont use name , use I. Don't use \n as line breaker. dont say i dont now.`,
    documents[0]
  );

  return {
    contact,
    education,
    experience,
    skills,
    conclusion,
    about,
  };
}

module.exports = { generateDocuments };
