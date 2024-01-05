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
        user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD
      },
    });

    // Setup email data
    const mailOptions = {
        from: `DO NOT REPLY <${process.env.ADMIN_EMAIL}>`,
        to: "rxr105@student.bham.ac.uk", //process.env.ADMIN_EMAIL,
        subject: `Category: ${category}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // message body in administrator's email
    };

    // Sending email from
    try {
      await transporter.sendMail(mailOptions);
      return new NextResponse("Feedback sent", { status: 200 } );
    } catch (error) {
      console.error('Error sending email:', error);
       return new NextResponse("User is Registered", { status: 500 } );
    }

}
