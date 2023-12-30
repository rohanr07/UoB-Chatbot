// pages/api/update-credentials.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import {authenticateUser, AuthResult} from "@/utils/authentication";
//import {NextResponse} from "next/server";
import connect from '@/utils/db';


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

    const requestBody = await streamToString( req.body)
    const parsedBody = JSON.parse(requestBody);

    const { currentPassword, newPassword } = parsedBody;
    const existingUser = await User.findOne({ email: userEmail });

  // Check if the current password is correct with existing stored password
  const isMatch = await bcrypt.compare(currentPassword, existingUser.password);

  if (!isMatch) {
      console.log("Current Password is Incorrect")
    return res.status(401).json({ message: 'Current Password is Incorrect' });
  }

  console.log("Current Password is Correct")

  // Hash the new password
  const salt = await bcrypt.genSalt(5);

  // Update the user's password with the new password (hashed)
  existingUser.password = await bcrypt.hash(newPassword, salt);
  await existingUser.save();

  res.status(200).json({ message: 'Password updated successfully' });
}








