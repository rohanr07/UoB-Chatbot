"use client";
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import styles from '@/app/Pages.module.css'
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Contact = () => {
  const router = useRouter();
  const { data: session } : any = useSession();
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session) {
        console.log("User is not authenticated. Redirecting to login page.");
        router.push("/login");
      } else {
        console.log("USER IS AUTHENTICATED");
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const feedbackData = {
      name: session?.user?.name,
      email: session?.user?.email,
      category,
      message
    };

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        console.log('Feedback Sent Successfully!');
        // Consider redirecting the user or showing a success message
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
        <div className={styles.pageContainer}>
          <h1>Contact</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.nameField}>
              Name: <span>{session?.user?.name || ''}</span>
            </div>
            <div className={styles.nameField}>
              Email: <span>{session?.user?.email || ''}</span>
            </div>
            <select
                //className={styles.nameField}
                onChange={(e) => setCategory(e.target.value)}
                defaultValue=""
                required
            >
              <option value="" disabled>
                HOW CAN WE HELP YOU?
              </option>

              <option value="can-not-register-login">Can't Register / Login</option>
              <option value="chatbot-not-functioning">Chatbot Not Functioning Properly</option>
              <option value="providing-wrong-info">Providing Wrong Information</option>
              <option value="other">Other</option>
              {/* ... other options ... */}
            </select>
            <div>
              Comments on the chatbot:
              <textarea
                  className={styles.textareaMessage}
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
              />
            </div>
            <div>
              <button type="submit" className={styles.submitButton}>Submit Feedback</button>
            </div>
          </form>
        </div>
      </>
  );
};

export default Contact;
