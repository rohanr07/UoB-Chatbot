import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import {authenticateUser, AuthResult} from "@/utils/authentication";

export const POST = async (request: any) => {
    console.log("at line 5 in POST");
    const { name, email, message } = await request.json(); //req.body;
console.log(" name ", name);


    const {userEmail, session}: AuthResult = await authenticateUser(request);
    if (!userEmail || !session) {
        return NextResponse.json({error: 'User not authenticated'}, {status: 401});
    }

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
     /*   host: 'smtp.gmail.com', // Gmail SMTP host
    port: 587, // SMTP port for TLS/STARTTLS
    secure: false, // false for TLS - uses STARTTLS
      */
        auth: {
        user: 'chatbotproj11@gmail.com',
        pass: 'hape mdvs tjka avji'
      //  user: 'rxr105uob@gmail.com', //'chatbotproj11@gmail.com',
      //  pass: '$3W00dlands2!$' //'Chatbot11proj$',
      },
    });

    // Setup email data
    const mailOptions = {
      from: '" DO NOT REPLY chatbotproj11@gmail.com ',
      to: 'chatbotproj11@gmail.com', //user,
      subject: 'Feedback Submission ', // + user,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return new NextResponse("Feedback sent", { status: 200 } );
     // res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
       return new NextResponse("User is Registered", { status: 500 } );
      //res.status(500).json({ success: false, error: 'Failed to send email.' });
    }

}
