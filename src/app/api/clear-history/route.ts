import {NextApiRequest, NextApiResponse} from "next";
import {authenticateUser, AuthResult} from "@/utils/authentication";
import { NextResponse } from 'next/server';
import chatMessage from "@/models/ChatMessage";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("Inside Clear History POST : Line 7")
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }


     try {
        // Clearing all records in MongoDB
        // This assumes you have a MongoDB collection set up
        await chatMessage.deleteMany({email: userEmail});
         {/*res.status(200).send('History Cleared');*/}
        return NextResponse.json({error: "History Cleared"}, {status: 200});
    } catch (error) {
        console.error('Error clearing history:', error);
         {/*res.status(500).send('Internal Server Error');*/}
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }





}





