 "use client";
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {getSession, useSession} from "next-auth/react";
import styles from '@/app/Pages.module.css'

const Change = () => {
  const { data: session } : any = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();

        useEffect(() => {
            if (!session) {
                // Redirect to login page if not signed in
                console.log("User is not authenticated. Redirecting to login page.");
                router.push("/login");
                return;
            } else {
                console.log(" USER IS AUTHENTICATED ");
            }
        }, []);

  const isFormValid = () => {
    return (
      (currentPassword && newPassword && newPassword === confirmNewPassword)
    );
  };

  const handleCancel = () => {
    // Go back to the previous page
    router.back();
  };

  const handleConfirm = async () => {
    if (!isFormValid()) return;

    try {
    const response = await fetch('/api/update-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Credentials updated successfully');
      router.back();
    } else {
      console.error('Failed to Update Credentials', data.message);
    }
  } catch (error) {
    console.error('Error updating credentials:', error);
  }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Change Password</h1>
        <div className="bg-[#212121] p-7 rounded shadow-md w-full max-w-md">
          <input
            className={styles.inputStyle}
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            className={styles.inputStyle}
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className={styles.inputStyle}
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
            <button className={styles.buttonCancel} onClick={handleCancel}>
              Cancel
            </button>
            <button className={styles.button} onClick={handleConfirm} disabled={!isFormValid()}>
              Confirm
            </button>
          </div>
        </div>
  );
};

export default Change;
