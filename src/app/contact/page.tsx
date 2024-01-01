"use client"
import React, { useState } from 'react';
import Head from 'next/head';

import styles from '@/app/Contact.module.css'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    helpCategory: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form data
    console.log(formData);
  };

  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className={styles.contactContainer}>
        <h1>Contact</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="YOUR NAME"
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="YOUR EMAIL ADDRESS"
            onChange={handleInputChange}
          />
          <select
              className={styles.selectWithCustomArrow}
              name="helpCategory"
              onChange={handleInputChange}
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
          <textarea
              name="message"
              placeholder="MESSAGE"
            onChange={handleInputChange}
          ></textarea>
          <button type="submit">SEND MESSAGE</button>
        </form>
      </div>
    </>
  );
};

export default Contact;
