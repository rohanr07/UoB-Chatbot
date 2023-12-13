"use client";
import { useState, useRef, useEffect } from "react";
//import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import React from "react";
import chatMessage from "@/models/ChatMessage";
// Define a type or interface for your message structure
interface Message1 {
  email: string,
  question: string;
  answer: string;
  timestamp: string;
}

//const Dashboard = async () => {
export default function Dashboard() {
   // const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const router = useRouter();
    const [chatHistories, setChatHistories] = useState<Message1[]>([]);

   /* const session = await getServerSession();
    if (!session) {
        redirect("/");
    }
*/
    useEffect(() => {
        const fetchChatHistory = async () => {
        const session = await getSession();

          if (!session) {
          // Redirect to login page if not logged in
          console.log("User is not authenticated. Redirecting to login page.");
          await router.push("/login");
         // return;
          }else {
              console.log( " USER IS AUTHENTICATED ");
          }
        //////////GET HISTORY FROM MONGO ////////


            try {
                console.log("Calling chatHISTORUY");
                fetch("/api/chat", {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                    //body: JSON.stringify({user: "rengajyoti@gmail.com"}),
                })
                    .then(async (res) => {
                        if (!res.ok) {
                            throw new Error("Failed to fetch chat history");
                        }

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
    }, []); // Empty dependency array to run once on component mount     useEffect



    ///// FINISHED GETTING HISTORY FROM MOnGO
 console.log('Chat Histories:', chatHistories);

  return (
     <main className="h-screen bg-gray-400 p-6 flex flex-col">
       <div className="mt-4 flex flex-col gap-2">
       <h1>Chat History </h1>

           <ul>
        {chatHistories.map((chatHistory, index) => (

  <li key={index}>
       <p className="text-sm font-medium text-slate-500">
           Question: {chatHistory.question} <br/>
           Answer: {chatHistory.answer} <br/>
           Timestamp: {chatHistory.timestamp?.toLocaleString()}<br/>
        </p>

     ---------------------------------------------------------------------------------------

  </li>
))}
      </ul>


      </div>
    </main>
     );
}; //Dashboard

//export default Dashboard;



