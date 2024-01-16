"use client";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {getSession} from "next-auth/react";
import React from "react";
import styles from '@/app/Pages.module.css'

// Defining interface for chat message
interface Message1 {
    email: string,
    question: string;
    answer: string;
    timestamp: string;
}

export default function ConversationHistory() {
    const router = useRouter();
    const [chatHistories, setChatHistories] = useState<Message1[]>([]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            const session = await getSession();

            if (!session) {
                // Redirect to login page if not signed in
                console.log("User is not authenticated. Redirecting to login page.");
                router.push("/login");
                return;
            } else {
                console.log(" USER IS AUTHENTICATED ");
            }

            // Getting History from MongoDB
            try {
                await fetch("/api/chat", {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                })
                    .then(async (res) => {
                        if (!res.ok) {
                            throw new Error("Failed to fetch chat history");
                        }

                        //
                        const resHistory = await res.json();
                        console.log(" resHistory2  ======", resHistory.decryptedChatHistory);

                        setChatHistories(resHistory.decryptedChatHistory);
                        console.log('Messages after setChatHistories:', chatHistories);
                    })
                    .catch((err) => {
                        alert(err);
                    });
                // await fetchChatHistory();
                console.log("AFTER Calling GET ");

            } catch (error) {
                console.error("Error fetching chat history:", error);
                throw error;
            }
        }
        fetchChatHistory();
    }, []);

    console.log('Chat Histories:', chatHistories);

    const handleClearHistory = async () => {
        console.log("Inside handleClearHistory() : Line 81")

        try {
            const response = await fetch('/api/clear-history', {method: 'POST'});
            if (response.ok) {
                console.log('History cleared');
                setChatHistories([]);
            } else {
                console.error('Failed to clear history');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <main className="h-screen bg-black-400 p-6 flex flex-col">

            <div style={{position: 'relative', height: '100%'}}>
                <button className={styles.button}
                        onClick={handleClearHistory}
                >
                    Clear History
                </button>
                <h1 className={styles.pageTitle}> Chat History </h1>

                <ul>
                    {chatHistories.map((chatHistory, index) => (

                        <li key={index}>
                            <p className={styles.historyContainer}>
                                Question: {chatHistory.question} <br/>
                                Answer: {chatHistory.answer} <br/>
                                <span style={{textAlign: 'right', display: 'block'}}>
           Timestamp: {chatHistory.timestamp}<br/>
           </span>
                            </p>

                            <p className={styles.miscellaneous}>
                                ------------------------------------------------------------------------------------------------------------------------------------------------------------
                            </p>

                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};



