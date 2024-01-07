import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import {authenticateUser, AuthResult} from "@/utils/authentication";

export const POST = async (request: any) => {
    console.log("at line 5 in POST");
    const { name, email, category, message } = await request.json(); //req.body;
console.log(" name ", name);
console.log(" category ", category);


    const {userEmail, session}: AuthResult = await authenticateUser(request);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }

    // Creating nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
     /*   host: 'smtp.gmail.com', // Gmail SMTP host
    port: 587, // SMTP port for TLS/STARTTLS
    secure: false, // false for TLS - uses STARTTLS
      */
        auth: {
        user: process.env.SERVER_EMAIL,
            pass: process.env.SERVER_PASSWORD
      },
    });

    // Setup email data
    const mailOptions = {
        from: `DO NOT REPLY <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Category: ${category}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // message body in administrator's email
    };

    // Sending email from
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({message: 'Feedback sent'}, { status: 200 } );
    } catch (error) {
      console.error('Error sending email:', error);
       return NextResponse.json({error: 'Error Sending Feedback'}, { status: 500 } );
    }
}
