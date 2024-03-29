import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import {authenticateUser, AuthResult} from "@/utils/authentication";


export const POST = async (request: any) => {
    console.log("at line 5 in POST");
    const { name, email, category, message, availability, visualAppeal, easeOfUse, overallImpression, respondByEmail } = await request.json();
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
    const mailOptions = {
        from: `DO NOT REPLY <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        cc: userEmail,
        subject: `Category: ${category}`,
        text: `Name: ${name}\n
        Email: ${email}\n
        Message: ${message}\n
        Availability: ${availability}\n
        Visual Appeal:  ${visualAppeal}\n
        Ease of Use: ${easeOfUse}\n 
        Overall Impression: ${overallImpression}\n
        Response Required: ${respondByEmail}`,

        html: `<p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Availability:</strong> ${availability}</p>
        <p><strong>Visual Appeal:</strong> ${visualAppeal}</p>
        <p><strong>Ease of Use:</strong> ${easeOfUse}</p>
        <p><strong>Overall Impression:</strong> ${overallImpression}</p>
        <p><strong>Response Required:</strong> ${respondByEmail}</p>`
    };

    // Sending email from
    try {
      await transporter.sendMail(mailOptions);
      console.log("Feedback Sent from Route")
      return NextResponse.json({message: 'Feedback Sent Successfully!'}, { status: 200 } );
    } catch (error) {
      console.error('Error sending email:', error);
       return NextResponse.json({error: 'Feedback Failed to Send'}, { status: 500 } );
    }
}
