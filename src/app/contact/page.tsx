"use client";
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import styles from '@/app/Contact.module.css'
import {getSession} from "next-auth/react";
//import {router} from "next/client";
import { useRouter } from "next/navigation";

const Contact = () => {
  const router = useRouter()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Define the async function inside useEffect
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        console.log("User is not authenticated. Redirecting to login page.");
        router.push("/login");
        return;
      } else {
        console.log(" USER IS AUTHENTICATED ");
      }
    };

    checkSession();
  }, []);

    const handleSubmit = async (e: any) => {
      e.preventDefault();

      const feedbackData = {name, email, message};

      try {
        const response = await fetch('/api/send-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });

        if (response.ok) {
          console.log('Feedback sent successfully!');
        } else {
          console.error('Failed to send feedback.');
        }
      } catch (error) {
        console.error('Error sending feedback:', error);
      }
    };

      return (
          <>
            <Head>
              <title>Contact Us</title>
            </Head>
            <div className={styles.contactContainer}>
              <h1>Contact</h1>
              <form onSubmit={handleSubmit}>
                <label>
                  Name:
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </label><br/>
                <label>
                  Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <br/>
                <select
                    className={styles.selectWithCustomArrow}
                    name="helpCategory"
                    onChange={(e) => setEmail(e.target.value)}
                    defaultValue=""
                >
                  <option value="" disabled>
                    HOW CAN WE HELP YOU?
                  </option>
                  {/* Add options here */}
                  <option value="change-order">Can't Register / Login</option>
                  <option value="change-order">Chatbot Not Working Properly</option>
                  <option value="change-order">Other</option>
                  {/* ... other options ... */}
                </select>
                <label>
                  Message:
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}/>
                </label>
                <br/>
                <button type="submit">Submit Feedback</button>
              </form>
            </div>
          </>
      );
};

export default Contact;
