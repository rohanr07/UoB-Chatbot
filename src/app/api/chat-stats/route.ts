import type {NextApiRequest, NextApiResponse} from 'next';
import {authenticateUser, AuthResult} from "@/utils/authentication";
import connect from '@/utils/mongodb';
import chatMessage from "@/models/ChatMessage";
import {NextResponse} from "next/server";


// helper function to convert file readable stream into JSON
async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const {userEmail, session}: AuthResult = await authenticateUser(req);

    await connect();

    if (!userEmail || !session) {
        return res.status(401).json({error: 'User not Authenticated'});
    }

    const requestBody = await streamToString(req.body)
    const parsedBody = JSON.parse(requestBody);
console.log(' parsed body', parsedBody);
    const {query, likeDislike} = parsedBody;
    console.log(' message....', query);
    console.log(' likeDislike', likeDislike);

    console.log('likeDislike', likeDislike)
   try{
    const chatMess = await chatMessage.findOneAndUpdate(
        {email: userEmail},
        { $set: { likeDislike: likeDislike } },
        { sort: { timestamp: -1 } }
    );

     return NextResponse.json({message: 'stats updated'}, {status: 200});

      }catch (error){
      console.error('Error verifying email:', error);
      return NextResponse.json({error: 'Error in updating Like/Dislike'}, {status: 500});
      }
}