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
      if (response.ok) {
        setVerificationStatus('Verification successful.');
        // You can redirect or perform other actions here
      } else {
        setVerificationStatus('Verification failed: ' + data.message);
      }
    } catch (error) {
      console.error('Verification request failed', error);
      setVerificationStatus('Verification request failed.');
    }
  };

  return (
    <div>
      <h1>Verification Page</h1>
      <p>{verificationStatus || 'Verifying...'}</p>
    </div>
  );
};

export default VerifyPage;
