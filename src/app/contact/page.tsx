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

  const [availability, setAvailability] = useState('');
  const [visualAppeal, setVisualAppeal] = useState('');
  const [easeOfUse, setEaseOfUse] = useState('');
  const [overallImpression, setOverallImpression] = useState('');
  const [respondByEmail, setRespondByEmail] = useState('');

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
      message,
      availability,
      visualAppeal,
      easeOfUse,
      overallImpression
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

        setTimeout(() => {
                router.push('/home');
            }, 1500);
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
              Name: {session?.user?.name || ''}
              <br/>
              Email: {session?.user?.email || ''}
            </div>
            What type of feedback do you have?
            <select
                //className={styles.nameField}
                onChange={(e) => setCategory(e.target.value)}
                defaultValue=""
                required
            >
              <option className={styles.pageContainer} value="" disabled>
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
              Availability of Information
              <select className={styles.optionDropDown}
                  onChange={(e) => setAvailability(e.target.value)}
                  defaultValue=""
                  required
              >
                <option value="" disabled>
                  Select Availability
                </option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
                <option value="Very Poor">Very Poor</option>
              </select>
            </div>
            <div>
              Visual Appeal
              <select className={styles.optionDropDown}
                  onChange={(e) => setVisualAppeal(e.target.value)}
                  defaultValue=""
                  required
              >
                <option className={styles.messageDropDown} value="" disabled>
                  Please Select
                </option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
                <option value="Very Poor">Very Poor</option>
              </select>
            </div>
            <div>
              Ease of Use/Accessibility
              <select className={styles.optionDropDown}
                  onChange={(e) => setEaseOfUse(e.target.value)}
                  defaultValue=""
                  required
              >
                <option className={styles.messageDropDown} value="" disabled>
                  Select Ease of Use/Accessibility
                </option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
                <option value="Very Poor">Very Poor</option>
              </select>
            </div>
            <div>
              Overall Impression
              <select className={styles.optionDropDown}
                  onChange={(e) => setOverallImpression(e.target.value)}
                  defaultValue=""
                  required
              >
                <option value="" disabled>
                  Select Overall Impression
                </option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
                <option value="Very Poor">Very Poor</option>
              </select>
            </div>
            <div>
              Would you like us to respond to your comments by sending you an email?
              <div>
                <input
                    type="radio"
                    id="respondYes"
                    name="respondByEmail"
                    value="Yes"
                    onChange={() => setRespondByEmail('Yes')}
                    checked={respondByEmail === 'Yes'}
                    required
                />
                <label htmlFor="respondYes">Yes</label>
                <input
                    type="radio"
                    id="respondNo"
                    name="respondByEmail"
                    value="No"
                    onChange={() => setRespondByEmail('No')}
                    checked={respondByEmail === 'No'}
                    required
                />
                <label htmlFor="respondNo">No</label>
              </div>
            </div>
            <div>
              <button type="submit" className={styles.button}>SUBMIT</button>
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
