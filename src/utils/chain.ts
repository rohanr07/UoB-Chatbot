import {OpenAI} from "langchain/llms/openai";
import {pinecone} from "@/utils/pinecone-client";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {ConversationalRetrievalQAChain} from "langchain/chains";

async function initChain() {
    const model = new OpenAI({});

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX ?? '');

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
            pineconeIndex: pineconeIndex,
            textKey: 'text',
        },
    );

    // Initializing a ConversationalRetrievalQAChain with the LLM and vector store from Pinecone
    return ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        {returnSourceDocuments: true} // Configures the chain to return the source documents alongside the generated answers
    );
}

export const chain = await initChain()