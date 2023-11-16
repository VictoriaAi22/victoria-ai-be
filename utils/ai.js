const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAI } = require("langchain/llms/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { Document } = require("langchain/document");
const { Pinecone } = require("@pinecone-database/pinecone");

const queryOpenAiToRefineResume = async (question, docs) => {
  const llm = new OpenAI({ temperature: 1 });
  const chain = loadQAStuffChain(llm);

  const result = await chain.call({
    input_documents: docs,
    question: question,
    options: {
      max_tokens: 10000,
    },
  });

  return result.text;
};

const queryPineconeVectorStoreAndQueryLLM = async (indexName, question) => {
  // 1. Start query process
  console.log("Querying Pinecone vector store...", question);
  // 2. Retrieve the Pinecone index
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const index = client.Index(indexName);
  // 3. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

  // 4. Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    topK: 10,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: true,
  });
  // 5. Log the number of matches
  console.log(`Found ${queryResponse.matches.length} matches...`);

  if (queryResponse.matches.length) {
    // 6. Log the question being asked
    console.log(`Asking question: ${question}...`);
    // 7. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({ temperature: 0.5 });
    const chain = loadQAStuffChain(llm);
    // 8. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata?.pageContent)
      .join(" ");
    // 9. Execute the chain with input documents and question

    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
      options: {
        max_tokens: 3000, // Set a higher value based on your requirements
      },
    });
    // 10. Log the answer
    // console.log("result is ", result);
    // console.log(`Answer: ${result.text}`);
    return result.text;
  } else {
    // 11. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};
const createPineconeIndex = async (indexName) => {
  // 1. Initiate index existence check
  console.log(`Checking "${indexName}"...`);
  // 2. Get list of existing indexes
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const existingIndexes = await client.listIndexes();
  console.log("existingIndexes is ", existingIndexes);
  // 3. If index doesn't exist, create it
  if (
    existingIndexes.length > 0 &&
    isIndexNameAlreadyTaken(existingIndexes, indexName)
  ) {
    const delete_index = await client.deleteIndex(indexName);
    console.log("delete_index reponse is ", delete_index);
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
  // 4. Log index creation initiation
  console.log(`Creating "${indexName}"...`);
  // 5. Create index
  const vectorDimension = 1536;
  await client.createIndex({
    name: indexName,
    dimension: vectorDimension,
    metric: "cosine",
  });
  // 6. Log successful creation
  console.log(`Creating index.... please wait for it to finish initializing.`);
  // 7. Wait for index initialization
  await new Promise((resolve) => setTimeout(resolve, 60000));
};
function isIndexNameAlreadyTaken(arr, name) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === name) {
      return true; // Name found in the array
    }
  }
  return false; // Name not found in the array
}
const updatePinecone = async (indexName, docs) => {
  console.log("Retrieving Pinecone index...");
  // 1. Retrieve Pinecone index
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const index = client.Index(indexName);
  // 2. Log the retrieved index name
  console.log(`Pinecone index retrieved: ${indexName}`);
  // 3. Process each document in the docs array
  for (const doc of docs) {
    console.log(`Processing document: ${doc.metadata.source}`);
    const txtPath = doc.metadata.source;
    const text = doc.pageContent;
    // 4. Create RecursiveCharacterTextSplitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    console.log("Splitting text into chunks...");
    // 5. Split text into chunks (documents)
    const chunks = await textSplitter.createDocuments([text]);
    console.log(`Text split into ${chunks.length} chunks`);
    console.log(
      `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
    );
    // 6. Create OpenAI embeddings for documents
    const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
      chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
    );
    console.log("Finished embedding documents");
    console.log(
      `Creating ${chunks.length} vectors array with id, values, and metadata...`
    );
    // 7. Create and upsert vectors in batches of 100
    const batchSize = 100;
    let batch = [];
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const vector = {
        id: `${txtPath}_${idx}`,
        values: embeddingsArrays[idx],
        metadata: {
          ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: txtPath,
        },
      };
      batch = [...batch, vector];
      // When batch is full or it's the last item, upsert the vectors
      if (batch.length === batchSize || idx === chunks.length - 1) {
        console.log("batch is ", batch);
        await index.upsert(batch);
        // Empty the batch
        batch = [];
      }
    }
    // 8. Log the number of vectors updated
    console.log(`Pinecone index updated with ${chunks.length} vectors`);
  }
};

module.exports = {
  queryOpenAiToRefineResume,
  queryPineconeVectorStoreAndQueryLLM,
  createPineconeIndex,
  updatePinecone,
};
