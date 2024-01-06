import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/utils/mongodb';
import User from '@/models/User';
import {NextResponse} from "next/server";

// converts file stream into string
async function streamToString(stream: any) {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
       }
      return Buffer.concat(chunks).toString('utf8');
      }

export async function POST(req: NextApiRequest, res: NextApiResponse) {
//export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Handler invoked'); // Add this line
  //if (req.method === 'POST') {
    const requestBody = await streamToString( req.body)

    const parsedBody = JSON.parse(requestBody);
    console.log('req', parsedBody); // Add this line
    //const { email: string } = req.query.email;
    //const { token: string } = req.query.token;

    const  email:string  = parsedBody.email;
    const  token: string = parsedBody.token;

      console.log(" inside API call 14");
      console.log("email", email);
      console.log("token", token);

    if (!email) {
      return res.status(400).json({ error: 'Email not provided' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token not provided' });
    }

    await connect();

    try {
      const user = await User.findOneAndUpdate(
        { email: email, verificationToken: token, isVerified: false },
        { $set: { isVerified: true, verificationToken: null } },
        { new: true }
      );

      if (!user) {
        return NextResponse.json({error: 'Invalid or Expired Token'}, {status: 404});
      }

        return NextResponse.json({error: 'Email verification successful'}, {status: 200});

    }catch (error){
      console.error('Error verifying email:', error);
      return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
      }
    //return NextResponse.json({error: 'Method not allowed'}, {status: 405});
}