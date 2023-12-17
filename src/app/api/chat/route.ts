import { NextRequest, NextResponse } from 'next/server';
import {chain} from "@/utils/chain";
import {Message} from "@/types/message";

import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser, AuthResult } from '@/utils/authentication';

import connect from "@/utils/mongodb";
import ChatMessage from "@/models/ChatMessage";
import user from "@/models/User";



export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }
    console.log(" USER EMAIL ", userEmail);

    const method= req.method;

  if (method === "GET") {
    return handleGet(userEmail);
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
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

export async function POST(req: NextApiRequest) {
    console.log("!!!!!!!!!!!! RR Request BEFORE !!!!!!!!!!!!", req.body);
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }
    console.log(" USER EMAIL ", userEmail);
    const requestBody = await streamToString( req.body)

    const parsedBody = JSON.parse(requestBody);
    console.log("!!!!!!!!!!!! RR Request AFTER !!!!!!!!!!!!", parsedBody);
    console.log("parsedBody " , parsedBody);

    if (req.method === "POST") {
        // const { query, history } = body;
        const { query, history } = parsedBody;
        console.log(" Query " , query);
        console.log(" History " , history);
        return handlePost(userEmail, query, history);
    } else {
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
};

async function handleGet(userEmail: string) {

            try {
                const chatHistory = await ChatMessage.find({email: userEmail}).sort({timestamp: -1});
                console.log("PRINT chatHistory", chatHistory);
                return NextResponse.json({chatHistory});
            } catch (error) {
                console.error("Error fetching chat messages:", error);
                return NextResponse.json({error: "Internal Server Error"}, {status: 500});
            }
        }

async function handlePost(userEmail: string, question :string, history: Message[] ) {
  ///
   /* temp commented to save $$
           const res = await chain.call({
            question: question,
            chat_history: history.map(h => h.content).join("\n"),
        });
    */
    // Replace the actual call to chain.call with a hardcoded result for testing
    const hardcodedResult = {
       text: 'This is a hardcoded response',
       sourceDocuments: [
       { metadata: { source: 'Hardcoded source 1' } },
       { metadata: { source: 'Hardcoded source 2' } },
       ],
      };

    // Use the hardcoded result instead of making an API call to save $$
    const res = await Promise.resolve(hardcodedResult);

    // Populate the conversation into MongoDB
    await ChatMessage.create({
    email: userEmail,
    question: question,
    answer: res.text
  });

    const links: string[] = Array.from(new Set(res.sourceDocuments.map((document: {metadata: {source: string}}) => document.metadata.source)))
    return NextResponse.json({role: "assistant", content: res.text, links: links})

}




