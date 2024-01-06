import User from "@/models/User"
import connect from "@/utils/mongodb"
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"
import crypto from 'crypto';
import nodemailer from 'nodemailer';

function generateVerificationToken() {
    const token: String = crypto.randomBytes(32).toString('hex');
    console.log("Token Generated: ", token)
    return token
}

async function sendVerificationEmail(email: string, verificationLink: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASSWORD
        },
    });

    const mailOptions = {
        from: '"DO NOT REPLY" <{process.env.SERVER_EMAIL}>',
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log('Error sending email:', error);
        return false;
    }
}

export const POST = async (request: any) => {
    const {name, email , password}= await request.json();

    await connect();

    const existingUser = await User.findOne({email});

    if (existingUser){
        return new NextResponse("Email is already in use", {status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    console.log("Name inside route", name);
    const newUser = new User ({
        name,
        email,
        password: hashedPassword,
        provider: 'credentials',
        isVerified: false,
        verificationToken: generateVerificationToken()
    });

    try {
        await newUser.save();
        console.log("New User Saved")

        const verificationLink = `http://localhost:3000/verify?email=${newUser.email}&token=${newUser.verificationToken}`;
        await sendVerificationEmail(newUser.email,verificationLink);

        return new NextResponse("User is Registered", { status: 200 } );

    } catch (err: any) {
        console.error("Error in user registration:", err.message);
        return new NextResponse("Registration failed", { status: 500 });
    }
};







