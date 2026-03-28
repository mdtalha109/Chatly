const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
const { ChatGroq } = require("@langchain/groq");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");
const { extractTextFromPdf } = require("./pdfProcessingService");
const path = require("path");

let pineconeClient;
let pineconeIndex;
let embeddings;

/**
 * Initialize Pinecone client and embeddings model
 */
async function initializePinecone() {
    try {
        if (!pineconeClient) {
            pineconeClient = new Pinecone({
                apiKey: process.env.PINECONE_API_KEY,
            });

            pineconeIndex = pineconeClient.Index('chatly-rag');

            const indexes = await pineconeClient.listIndexes();
            console.log("Existing Pinecone indexes:", indexes);
            console.log("Pinecone client initialized with index:", process.env.PINECONE_INDEX_NAME, 'process.env.PINECONE_API_KEY: ', process.env.PINECONE_API_KEY);
            // Initialize HuggingFace embeddings model via Inference API
            embeddings = new HuggingFaceInferenceEmbeddings({
                apiKey: process.env.HUGGINGFACE_API_KEY,
                model: "sentence-transformers/all-mpnet-base-v2",
            });

            console.log("Pinecone and embeddings initialized successfully");
        }
        return { pineconeIndex, embeddings };
    } catch (error) {
        throw new Error(`Failed to initialize Pinecone: ${error.message}`);
    }
}

/**
 * Process PDF: Extract, chunk, embed, and store in Pinecone
 * @param {string} filePath - Local file path of the PDF
 * @param {string} pdfId - MongoDB document ID
 * @returns {Promise<{chunkCount: number, embeddingModel: string}>}
 */
async function processPDF(filePath, pdfId) {
    try {
        await initializePinecone();

        // Extract text using pdf2json (our working implementation)
        console.log("Extracting text from PDF file:", filePath);
        const { text, numPages, metadata } = await extractTextFromPdf(filePath, true);

        if (!text || text.trim().length === 0) {
            throw new Error("No text extracted from PDF - PDF may be empty or contain only images");
        }

        // Create a LangChain Document from the extracted text
        const document = new Document({
            pageContent: text,
            metadata: {
                pdfId: pdfId,
                numPages: numPages,
                ...metadata
            }
        });

        // Split document into chunks
        console.log("Splitting text into chunks...");
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });
        const docs = await textSplitter.splitDocuments([document]);

        console.log("Created", docs.length, "chunks");

        if (!docs || docs.length === 0) {
            throw new Error("No text chunks created from PDF");
        }

        // Add metadata to each chunk
        docs.forEach((doc, index) => {
            doc.metadata = {
                ...doc.metadata,
                pdfId: pdfId,
                chunkIndex: index,
            };
        });

        console.log(`Created ${docs.length} chunks, storing in Pinecone...`);


        const vectors = await embeddings.embedDocuments(
            docs.map(d => d.pageContent)
        );

        await pineconeIndex.upsert({
            namespace: pdfId,
            records: [
                {
                    id: "test1",
                    values: vectors[0],
                    metadata: {
                        text: docs[0].pageContent
                    }
                }
            ]
        });


        // Store in Pinecone with embeddings
        // await PineconeStore.fromDocuments(docs, embeddings, {

        //   pineconeIndex,
        //   namespace: pdfId, // Use pdfId as namespace for isolation
        // });

        const records = vectors.map((vector, i) => ({
            id: `${pdfId}-${i}`,
            values: vector,
            metadata: {
                text: docs[i].pageContent,
                pdfId,
                chunkIndex: i
            }
        }));

        console.log("records: ", records)

        await pineconeIndex.upsert({
            namespace: pdfId,
            records
        });

        console.log(`Successfully processed PDF with ${docs.length} chunks`);

        return {
            chunkCount: docs.length,
            embeddingModel: "sentence-transformers/all-MiniLM-L6-v2",
        };
    } catch (error) {
        throw new Error(`Failed to process PDF: ${error}`);
    }
}

/**
 * Query PDF using RAG with Groq LLM
 * @param {string} pdfId - MongoDB document ID
 * @param {string} question - User's question
 * @param {Object} options - Optional configuration
 * @param {boolean} options.stream - Enable streaming mode
 * @param {Function} options.onChunk - Callback for streaming chunks (chunk) => void
 * @returns {Promise<{answer: string, tokenUsage: Object}>} AI-generated answer with token usage
 */
async function queryPDF(pdfId, question, options = {}) {
    try {
        await initializePinecone();

        console.log(`Querying PDF ${pdfId} with question: ${question}`);

        // Generate embedding for the question
        const questionEmbedding = await embeddings.embedQuery(question);

        // Search Pinecone for relevant chunks
        const searchResults = await pineconeIndex.query({
            namespace: pdfId,
            vector: questionEmbedding,
            topK: 5, // Retrieve top 5 most relevant chunks
            includeMetadata: true,
        });

        console.log(`Found ${searchResults.matches?.length || 0} relevant chunks`);

        if (!searchResults.matches || searchResults.matches.length === 0) {
            const fallbackMsg = "I couldn't find any relevant information in the document to answer your question.";
            if (options.stream && options.onChunk) {
                options.onChunk(fallbackMsg);
            }
            return {
                answer: fallbackMsg,
                tokenUsage: {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0
                }
            };
        }

        // Extract the text from matched chunks
        const context = searchResults.matches
            .map(match => match.metadata?.text || '')
            .filter(text => text.trim().length > 0)
            .join('\n\n');

        console.log('Context length:', context.length);

        // Initialize Groq LLM
        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            streaming: options.stream || false,
        });

        // Create a prompt with context and question
        const prompt = `Based on the following context from a document, please answer the question. If the answer cannot be found in the context, say so.

        Context: ${context}
        Question: ${question}

        Answer:`;

        // Handle streaming vs non-streaming
        if (options.stream && options.onChunk) {
            // Streaming mode
            let fullAnswer = '';
            let tokenUsage = {
                promptTokens: 0,
                completionTokens: 0,
                totalTokens: 0
            };
            
            const stream = await llm.stream(prompt);
            
            for await (const chunk of stream) {
                console.log('Received chunk:', chunk);
                const text = chunk.content || '';
                if (text) {
                    fullAnswer += text;
                    options.onChunk(text);
                }
                
                // Capture token usage from chunk metadata if available
                if (chunk.response_metadata?.usage) {
                    tokenUsage = {
                        promptTokens: chunk.response_metadata.usage.prompt_tokens || 0,
                        completionTokens: chunk.response_metadata.usage.completion_tokens || 0,
                        totalTokens: chunk.response_metadata.usage.total_tokens || 0
                    };
                }
            }
            
            console.log('Token usage:', tokenUsage);
            
            return {
                answer: fullAnswer,
                tokenUsage
            };
        } else {
            // Regular mode (non-streaming)
            const response = await llm.invoke(prompt);
            const answer = typeof response.content === 'string' 
                ? response.content 
                : response.content[0]?.text || response.text || 'No answer generated';
            
            // Extract token usage from response metadata
            const tokenUsage = {
                promptTokens: response.response_metadata?.usage?.prompt_tokens || 0,
                completionTokens: response.response_metadata?.usage?.completion_tokens || 0,
                totalTokens: response.response_metadata?.usage?.total_tokens || 0
            };
            
            console.log('Token usage:', tokenUsage);
            
            return {
                answer,
                tokenUsage
            };
        }
    } catch (error) {
        throw new Error(`Failed to query PDF: ${error.message}`);
    }
}

module.exports = {
    initializePinecone,
    processPDF,
    queryPDF,
};
