"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import React from "react";

// Defining interface for chat message
interface Message1 {
  email: string,
  question: string;
  answer: string;
  timestamp: string;
}

export default function ConversationHistory(){
    const router = useRouter();
    const [chatHistories, setChatHistories] = useState<Message1[]>([]);

    useEffect(() => {
        const fetchChatHistory = async () => {
        const session = await getSession();

          if (!session) {
          // Redirect to login page if not signed in
          console.log("User is not authenticated. Redirecting to login page.");
          await router.push("/login");
          return;
          }else {
              console.log( " USER IS AUTHENTICATED ");
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
                        const resHistory  = await res.json();
                        console.log(" resHistory1  ======", resHistory);
                        console.log(" resHistory2  ======", resHistory.chatHistory);

                       // setChatHistories([resHistory]);
                        setChatHistories(resHistory.chatHistory);
                        console.log('Messages after setChatHistories:', chatHistories);

                        // if (!resHistory || !resHistory.chatMessages || !Array.isArray(data.chatMessages)) {
                        //    throw new Error("Invalid response format");
                        // }c
                        //setHistory((oldHistory) => [...oldHistory, r]);
                        //setLoading(false);
                    })
                    .catch((err) => {
                        alert(err);
                    });
               // await fetchChatHistory();
                console.log("AFTER Calling GET ");

            } catch (error) {
                console.error("Error fetching chat history:", error);
                throw error; // Rethrow the error for the calling function to handle
            }
        } //fetChatHistory
        // Call the function to fetch chat history
        fetchChatHistory();
    }, []);
    // Obtained History from MongoDB


    // debug line: printing chat histories
    console.log('Chat Histories:', chatHistories);

    // makes an API call to clear chat history from front UI and MongoDB
    const handleClearHistory = async () => {
        console.log("Inside handleClearHistory() : Line 81")

    // Makes an API call to clear the MongoDB chat history records
    try {
        const response = await fetch('/api/clear-history', { method: 'POST' });
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

         <div style={{ position: 'relative', height: '100%' }}>
             {/* ... your existing UI components ... */}
             <button
                 style={{
                     position: 'absolute',
                     top: 0,
                     right: 0,
                     margin: '10px',
                     // Add more styling as needed
                     }}
                     onClick={handleClearHistory}
    >
        Clear History
    </button>
             {/*</div>*/}




         {/* <div className="mt-4 flex flex-col gap-2"> */}
       <h1> Chat History </h1>

           <ul>
        {chatHistories.map((chatHistory, index) => (

  <li key={index}>
       <p className="text-sm font-medium text-slate-500">
           Question: {chatHistory.question} <br/>
           Answer: {chatHistory.answer} <br/>
           <span style={{ textAlign: 'right', display: 'block' }}>
           Timestamp: {chatHistory.timestamp}<br/>
           </span>
        </p>

     ------------------------------------------------------------------------------------------------------------------------------------------------------------

  </li>
))}
      </ul>


      </div>
    </main>
     );
};



