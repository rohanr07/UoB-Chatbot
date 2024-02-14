"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { getSession } from 'next-auth/react';
import styles from '@/app/Pages.module.css';

const Change = () => {
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const router = useRouter();
  //const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const fetchSession = async () => {
        const session = await getSession();

        if (!session) {
            // Redirect to login page if not signed in
            console.log("User is not authenticated. Redirecting to login page.");
            router.push("/login");
            return;
        } else {
            console.log(" USER IS AUTHENTICATED ");
        }
    };

     console.log("Fetching session...");
    fetchSession();
}, []);

      const isFormValid = () => {
          console.log(' inside isFormValid');
    if (newPassword !== confirmNewPassword) {
        setError('New passwords do not match');
        return false;
    }
    if (currentPassword === newPassword) {
        setError('New password cannot be same as current password');
        return false;
    }
    if (newPassword.length < 7) {
        setError('Password should be at least 7 characters long');
        return false;
    }
    if (!/[A-Z]/.test(newPassword)) {
        setError('Password should contain an uppercase character');
        return false;
    }
    if (!/[a-z]/.test(newPassword)) {
        setError('Password should contain a lowercase character');
        return false;
    }
    if (!/\d/.test(newPassword)) {
        setError('Password should contain a number');
        return false;
    }
    // Clear error if all validations pass
    setError('');
    return true;
};

      const handleCancel = () => {
          router.back(); // Go back to the previous page
      };

      const handleConfirm = async (e: any) => {
          console.log('AT 70');
             e.preventDefault();
          if (!isFormValid()) return  false;

          console.log('Form is valid');
         /* if (newPassword !== confirmNewPassword) {
        setError('New passwords do not match');
        return;
    }
      if (!/[a-z]/.test(newPassword)) {
        setError('Password should contain a lowercase character');
        return;
       }*/
          try {
              const response = await fetch('/api/update-credentials', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({currentPassword, newPassword}),
              });
              if (response.ok) {
                  console.log('Credentials updated successfully');
                  setError('Credentials updated successfully');
                  //router.back();       router.push("/login");
              } else {
                  // If the response is not successful, handle the error
                  return response.json().then(data => {
                      // Access the error message and status code
                      const errorMessage = data.error;
                      const statusCode = response.status;
                      console.log(" statusCode:", statusCode)
                      // Handle the error appropriately (e.g., display an error message)
                      console.error(`Error ${statusCode}: ${errorMessage}`);
                      console.error('Failed to Update Credentials', data.message);
                      setError(`${errorMessage}`);


                  });

              }
          } catch (error) {
              console.error('Error updating credentials:', error);
          }
      };


  return (
<div className={styles.pageContainer}>
    <div className={styles.credentialFields}>
        <h1 className={styles.pageTitle}>Change Password</h1>
        <form onSubmit={handleConfirm}>
            <div className="bg-[#212121] p-7 rounded shadow-md w-full max-w-md">
                <input
                    className={styles.credentialsPage}
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    className={styles.credentialsPage}
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    className={styles.credentialsPage}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button className={styles.buttonCancel} type="button"
                        onClick={handleCancel}> {/* Use type="button" to prevent form submission */}
                    Cancel
                </button>
                <button className={styles.button}
                        type="submit"
                >

                    Confirm
                </button>
            </div>

            <br/>

        <p className={styles.passwordRules}>
            <b>Password must contain...</b>
        </p>
         <ul className={styles.passwordRules}>
                <li>At least 7 characters</li>
                <li>An uppercase character</li>
                <li>A lowercase character</li>
                <li>A number</li>
            </ul>

        {error && (
            <p className={styles.errorMessage}>{error}</p>
        )}
                </form>

         </div>
    </div>

    );
    };

    export default Change;