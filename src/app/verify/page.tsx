"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  useEffect(() => {

    const queryEmail = searchParams.get('email');
    const queryToken = searchParams.get('token');

    if (queryEmail && queryToken) {
      setEmail(queryEmail);
      setToken(queryToken);
      verifyToken(queryEmail, queryToken);
    }
  }, [searchParams]);
  const verifyToken = async (email: string, token: string) => {
    try {
      console.log(" inside API call");
      console.log("email", email);
      console.log("token", token);

      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();
      console.log("Response: ", response);
      console.log("Data: ", data);

      if (response.ok) {
        setVerificationStatus('Verification Successful');
        // You can redirect or perform other actions here
      } else {
        setVerificationStatus('Verification Failed: ' + data.error);
      }
    } catch (error) {
      console.error('Verification Request Failed', error);
      setVerificationStatus('Verification Request Failed');
    }
  };

  return (
    <div >
      <h1>Verification Page</h1>
      <p>{verificationStatus || 'Verifying...'}</p>
    </div>
  );
};

export default VerifyPage;
