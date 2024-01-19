import {OpenAI} from "langchain/llms/openai";
import {pinecone} from "@/utils/pinecone-client";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {ConversationalRetrievalQAChain} from "langchain/chains";

async function initChain(): Promise<ConversationalRetrievalQAChain> {
    try {
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo",
            temperature: 0.1
        });

        const pineconeIndexName = process.env.PINECONE_INDEX ?? '';
        if (!pineconeIndexName) {
            throw new Error("PINECONE_INDEX environment variable is not set.");
        }

        const pineconeIndex = pinecone.Index(pineconeIndexName);

        console.log("Pinecone Index: +", pineconeIndex);

        /* create vector store */
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({}),
            {
                pineconeIndex: pineconeIndex,
                textKey: 'text',
            },
        );

        console.log("Vector Store Populated");

        // Initializing a ConversationalRetrievalQAChain with the LLM and vector store from Pinecone
        return ConversationalRetrievalQAChain.fromLLM(
            model,
            vectorStore.asRetriever(),
            {returnSourceDocuments: true} // Returning source documents alongside the generated answers
        );
    } catch (error: unknown) {
        // Here we check if the error is an instance of Error to access the message property
        if (error instanceof Error) {
            console.error("Failed to initialize chain:", error.message);
        } else {
            console.error("An unexpected error occurred");
        }
        // The type of the error should be handled as appropriate for your use case.
        throw error;
    }
}
export const chain = await initChain()
