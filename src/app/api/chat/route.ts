import {NextResponse} from 'next/server';
import {Message} from "@/types/message";
import {NextApiRequest} from 'next';
import {authenticateUser, AuthResult} from '@/utils/authentication';
import ChatMessage from "@/models/ChatMessage";
import {encryptMessage, decryptMessage} from "@/utils/hashedSecurity";
import {chain} from "@/utils/chain";
import axios from "axios";

export async function GET(req: NextApiRequest) {
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }
    console.log(" USER EMAIL ", userEmail);

    const method = req.method;

    if (method === "GET") {
        return handleGet(userEmail);
    } else {
        return NextResponse.json({error: "Method not allowed"}, {status: 405});
    }
}

// helper function to convert file readable stream into JSON
async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

function formatMongoTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    return `${formattedDate} at ${formattedTime}`;
}

export async function POST(req: NextApiRequest) {
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }
    console.log(" USER EMAIL ", userEmail);
    const requestBody = await streamToString(req.body)

    const parsedBody = JSON.parse(requestBody);

    if (req.method === "POST") {
        const {query, history} = parsedBody;
        console.log(" Query ", query);
        console.log(" History ", history);
        console.log(" History Printed");
        return handlePost(userEmail, query, history);
    } else {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
}

async function handleGet(userEmail: string) {
    try {
        const chatHistory = await ChatMessage.find({email: userEmail}).sort({timestamp: -1});
        console.log("PRINT chatHistory", chatHistory);

        // Decrypt the messages in chatHistory
        const decryptedChatHistory = chatHistory.map((message) => ({
            email: message.email,
            question: decryptMessage(message.question),
            answer: decryptMessage(message.answer),
            timestamp: formatMongoTimestamp(message.timestamp)
        }));

        return NextResponse.json({decryptedChatHistory});
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

async function handlePost(userEmail: string, question: string, history: Message[]) {

    try {
        const res = await chain.call({
            question: question,
            chat_history: history.map(h => h.content).join("\n"),
        });

        if ((question.toUpperCase() === "HELLO") || (question.toUpperCase() === "HI") || (question.trim() === '')) {
            res.text = "Hi, how can I help you?";
        } else if (!res || res.text.trim() === '' || res.text.trim().toUpperCase() === "I DON'T KNOW.") {
            res.text = "My database does not currently contain this information.  Please visit https://www.birmingham.ac.uk/index.aspx"
        }

        // Decrypt the messages in chatHistory
        const encryptedQuestion = encryptMessage(question)
        const encryptedResponse = encryptMessage(res.text)

        // Populate the conversation into MongoDB
        await ChatMessage.create({
            email: userEmail,
            question: encryptedQuestion,
            answer: encryptedResponse
        });
        const links: string[] = Array.from(new Set(res.sourceDocuments.map((document: {
            metadata: { source: string }
        }) => document.metadata.source)))
        return NextResponse.json({role: "assistant", content: res.text, links: links})

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            // error is an AxiosError
            console.error("Axios error details:", error.toJSON());
        } else if (error instanceof Error) {
            // error is a generic Error object
            console.error("Error in chain.call:", error.message);
        } else {
            // error is of some other type
            console.error("An unknown error occurred:", error);
        }
        return NextResponse.json({error: "Error in langchain chain.call"}, {status: 405});
    }
}



