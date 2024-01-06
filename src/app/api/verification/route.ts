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
  console.log('Handler invoked');
    const requestBody = await streamToString( req.body)

    const parsedBody = JSON.parse(requestBody);
    console.log('req', parsedBody);

    const  email:string  = parsedBody.email;
    const  token: string = parsedBody.token;

      console.log(" inside API call 14");
      console.log("email", email);
      console.log("token", token);

    if (!email) {
      return NextResponse.json({error: 'Email Not Provided'}, {status: 400});
    }

    if (!token) {
      return NextResponse.json({error: 'Token Not Provided'}, {status: 400});
    }

    await connect();

    try {

      // checking if email was registered before and is present in MongoDB
      const emailFound = await User.findOne({email: email})
      if (!emailFound) {
        console.log("Inside Email Check in MongoDB")
        return NextResponse.json({error: 'Email Not Registered'}, {status: 404});
      }

      const user = await User.findOneAndUpdate(
        { email: email, verificationToken: token, isVerified: false },
        { $set: { isVerified: true, verificationToken: null } },
        //{ new: true }
      );
    console.log("email   :", email)
    console.log("token   :", token)
   console.log("find returns", user)
      if (!user) {
        return NextResponse.json({error: 'Invalid or Expired Token'}, {status: 404});
      }

      return NextResponse.json({message: 'Email Verification Successful'}, {status: 200});

    }catch (error){
      console.error('Error verifying email:', error);
      return NextResponse.json({error: 'Internal Server Error\nPlease try again later'}, {status: 500});
      }
}