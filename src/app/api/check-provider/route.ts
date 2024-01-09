import { NextApiRequest } from 'next';
import connect from '@/utils/mongodb';
import User from '@/models/User';
import {NextResponse} from "next/server";
import {authenticateUser, AuthResult} from "@/utils/authentication";

export async function GET(req: NextApiRequest) {
    console.log("Inside Check Provider POST : Line 8")
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User Not Authenticated'}, {status: 401});
    }

    await connect();

    try {
      const count = await User.countDocuments(
        { email: userEmail, provider: 'credentials'}
      );

      if (count > 0 ) {
        console.log('Password Change Allowed');
        return NextResponse.json({message: 'Password Change Allowed'}, {status: 200});
     }else {
          console.log('Password Change Not Allowed');
          return NextResponse.json({error: 'Password Change Not Allowed'}, {status: 404});
      }
    }catch (error){
      return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
      }



}