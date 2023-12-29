 "use client";
import React, { useState } from 'react';
//import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';

const Change = () => {
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();

  const isFormValid = () => {
    return (
      newUsername ||
      (currentPassword && newPassword && newPassword === confirmNewPassword)
    );
  };

  const handleCancel = () => {
    // Go back to the previous page
    router.back();
  };

  const handleConfirm = async () => {
    if (!isFormValid()) return;

    // Call your API to update the user's username/password
    try {
      // Example API call
      const response = await fetch('/api/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername, currentPassword, newPassword }),
      });

      if (response.ok) {
        // Handle success
        console.log('Credentials updated successfully');
        router.back();
      } else {
        // Handle error
        console.error('Failed to update credentials');
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl text-center font-semibold mt-6 mb-4">Change Username / Password</h1>
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-[#212121] p-8 rounded shadow-md w-full max-w-md">
          <input
            className="mb-4 p-2 text-black"
            type="text"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
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
