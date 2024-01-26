"use client";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {getSession} from "next-auth/react";
import React from "react";
import styles from '@/app/Pages.module.css'
import searchIcon from '/public/images/searchIcon1.png';
import Image from "next/image";

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

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHistories, setFilteredHistories] = useState<Message1[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
                        setFilteredHistories(resHistory.decryptedChatHistory);
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
                setFilteredHistories([]);
            } else {
                console.error('Failed to clear history');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSearchHistory = () => {
        if (!searchQuery) {
            // If the search query is empty, show all chatHistories
            setFilteredHistories(chatHistories);
        } else {
            // If there is a search query, filter chatHistories
            const filtered = chatHistories.filter(history =>
                history.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                history.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredHistories(filtered);
        }
    };

    const handleSortHistory = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sortedHistories = [...filteredHistories].sort((a, b) => {
            const timestampA = new Date(a.timestamp).getTime();
            const timestampB = new Date(b.timestamp).getTime();

            return sortOrder === "asc" ? timestampA - timestampB : timestampB - timestampA;
        });
        setFilteredHistories(sortedHistories);
    };
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}> Chat History </h1>
            <div className={styles.headerContainer}>
                <input
                    style={{
                        width: '80%',
                        border: '1px solid whitesmoke',
                        color: 'black',
                        borderRadius: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        marginBottom: '1rem'
                    }}
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img
                    src={searchIcon.src}
                    alt="Search History"
                    className={styles.searchIcon}
                    onClick={handleSearchHistory}
                />
                <button className={styles.button} onClick={handleSortHistory}>
                    Sort {sortOrder === "asc" ? "↑" : "↓"}
                </button>
                <button className={styles.button} onClick={handleClearHistory}>
                    Clear History
                </button>
            </div>

            <ul>
                {filteredHistories.map((chatHistory, index) => (

                    <li key={index}>
                        <p className={styles.historyContainer}>
                            Question: {chatHistory.question} <br/>
                            Answer: {chatHistory.answer} <br/>
                            <span style={{textAlign: 'right', display: 'block'}}>
                                Timestamp: {chatHistory.timestamp}<br/>
                            </span>
                        </p>

                        <p className={styles.miscellaneous}>
                            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </p>

                    </li>
                ))}
            </ul>
        </div>
    )
        ;
};