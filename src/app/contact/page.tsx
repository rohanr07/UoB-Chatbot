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
  const [contactEmailStatus, setContactEmailStatus] = useState<string>('');

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

      const data = await response.json();

      if (response.ok) {
        setContactEmailStatus('Feedback Sent Successfully!');
        console.log("Set Contact email is set")
      } else {
        setContactEmailStatus('Feedback Failed to Send');
        console.log("Not Set")
      }
    } catch (error) {
      setContactEmailStatus('Feedback Failed. Error: '+error);
      console.error('Error sending feedback:', error);
    }
  };

  useEffect(() => {
    console.log("contactEmailStatus updated: ", contactEmailStatus);
    }, [contactEmailStatus]);


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
              <button type="submit" className={styles.button}>Submit Feedback</button>
            </div>

            <div className={styles.serverMessage}>
              <p>{contactEmailStatus}</p>
            </div>

          </form>
        </div>
      </>
  );
};

export default Contact;
