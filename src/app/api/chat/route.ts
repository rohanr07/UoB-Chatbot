import { NextResponse } from 'next/server';
import {chain} from "@/utils/chain";
import {Message} from "@/types/message";

import connect from "@/utils/mongodb";
import ChatMessage from "@/models/ChatMessage";
import user from "@/models/User";

export async function GET(request: { method: string }) {
     console.log(" INSIDE route GET....");
  if (request.method === "GET") {
    // Ensure Mongoose connection
    await connect();   //debug
    return handleGet();
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

export async function POST(request: Request) {
    const body = await request.json();
    const question: string = body.query;
    const history: Message[] = body.history ?? []
    console.log ("INSIDE POST query ", question);
  if (request.method === "POST") {
    // Ensure Mongoose connection
    await connect();   //debug
    return handlePost(question, history);
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

async function handleGet() {
  // Handle GET request logic here
  // For example, fetching chat history from the database
   console.log(" INSIDE GET HANDLER IN ROUTE");
  const userEmail = "admin@gmail.com";  // Replace with logic to get user email
//  await connect(); // Ensure the database connection is established

  try {
    console.log(" userEmail used for FIND", userEmail);
    const chatHistory  = await ChatMessage.find({ email: userEmail }).sort({ timestamp: -1 });

    console.log( "PRINT chatHistory",chatHistory);
    return NextResponse.json({ chatHistory });
   } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function handlePost(question :string, history: Message[] ) {
  // const body = await request.json();
  //    console.log("HANDLE POST QUESTION IS 1:", request.query);
   // const question: string = request.query;
    console.log("HANDLE POST QUESTION IS 2", question);

 //   const history: Message[] = request.history ?? []
//
    const userEmail = user;
    console.log(" USER  " +userEmail);

    //getSession(request);

    if (!userEmail) {
    return new NextResponse("User not authenticated", { status: 401 });
  }
  ///
   /* temp commented to save $$$$$
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

    // Use the hardcoded result instead of making an API call
    const res = await Promise.resolve(hardcodedResult);

    // start adding JR
    // Insert the chat question and answer into the database
    await connect(); // Ensure the database connection is established
    await ChatMessage.create({
    email: "jyotiren@gmail.cm",
    question: question,
    answer: res.text
  });

  // added JR
    console.log("SOURCE DOCUMENTS :" + res.sourceDocuments)

    const links: string[] = Array.from(new Set(res.sourceDocuments.map((document: {metadata: {source: string}}) => document.metadata.source)))
    return NextResponse.json({role: "assistant", content: res.text, links: links})
}




