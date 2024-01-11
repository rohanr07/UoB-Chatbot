 "use client";
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import {getSession, useSession} from "next-auth/react";

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
      // You could set an error state here and display it to the user
    }
  } catch (error) {
    console.error('Error updating credentials:', error);
    // Handle error
  }
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl text-center font-semibold mt-6 mb-4">Change Name / Password</h1>
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-[#212121] p-8 rounded shadow-md w-full max-w-md">
          <input
            className="mb-4 p-2 text-black"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            className="mb-4 p-2 text-black"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="mb-4 p-2 text-black"
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <button onClick={handleCancel} style={{ backgroundColor: 'red' }}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{
                backgroundColor: isFormValid() ? 'green' : 'grey',
              }}
              disabled={!isFormValid()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Change;
