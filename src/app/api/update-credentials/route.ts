// pages/api/update-credentials.ts
import type {NextApiRequest} from 'next';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import {authenticateUser, AuthResult} from "@/utils/authentication";
import {NextResponse} from "next/server";
import connect from '@/utils/mongodb';


// helper function to convert file readable stream into JSON
async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

export async function POST(req: NextApiRequest) {
    const {userEmail, session}: AuthResult = await authenticateUser(req);
    console.log('Inside update -credentials');
    //await connect();

    if (!userEmail || !session) {
        //return res.status(401).json({error: 'User not Authenticated'});
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }

    const requestBody = await streamToString(req.body)
    const parsedBody = JSON.parse(requestBody);

    const {currentPassword, newPassword} = parsedBody;
    const existingUser = await User.findOne({email: userEmail});

    // Check if the current password is correct with existing stored password
    const isMatch = await bcrypt.compare(currentPassword, existingUser.password);

    if (!isMatch) {
        console.log("Current password is Incorrect")
        return NextResponse.json({error: 'Current Password is incorrect'}, {status: 501});
    }

    console.log("Current Password is Correct")

    // Hash the new password
    const salt = await bcrypt.genSalt(5);

    // Update the user's password with the new password (hashed)
    existingUser.password = await bcrypt.hash(newPassword, salt);
    await existingUser.save();

    //res.status(200).json({ message: 'Password updated successfully' });
    return NextResponse.json({message: 'Password updated successfully'}, {status: 200});
}