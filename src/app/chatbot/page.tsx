"use client";
import { useState, useRef, useEffect } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"

import { Message } from "@/types/message";
// importing library to use the icons
import { Send } from "react-feather";
import LoadingDots from "@/app/components/LoadingDots";
import {useSession} from "next-auth/react";


const Chatbot = async () => {
    const session = await getServerSession();
    if (!session) {
        // if session does not exist then redirecting to home route
        redirect("/")
    }
};

    export default function Home() {
        const { data: session } = useSession();
        const [message, setMessage] = useState<string>("");
        const [history, setHistory] = useState<Message[]>([
            {
                role: "assistant",
                content:
                    //"Hello " + session.user.name +"!  Ask me anything about the University of Birmingham.",
                "Hello! Ask me anything about the University of Birmingham.",
            },
        ]);
        const lastMessageRef = useRef<HTMLDivElement | null>(null);
        const [loading, setLoading] = useState<boolean>(false);

        const handleClick = () => {
            // checking if user has typed a message in the prompt
            if (message == "") return;

            // providing chatbot with context by feeding in previous message by the user
            setHistory((oldHistory) => [
                ...oldHistory,
                {role: "user", content: message},
            ]);
            setMessage("");
            setLoading(true);
            fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({query: message, history: history}),
            })
                .then(async (res) => {
                    const r = await res.json();
                    setHistory((oldHistory) => [...oldHistory, r]);
                    setLoading(false);
                })
                .catch((err) => {
                    alert(err);
                });
        };

        const formatPageName = (url: string) => {
            // Split the URL by "/" and get the last segment
            const pageName = url.split("/").pop();

            // Split by "-" and then join with space
            if (pageName) {
                const formattedName = pageName.split("-").join(" ");

                // Capitalize only the first letter of the entire string
                return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
            }
        };

        //scroll to bottom of chat
        useEffect(() => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({behavior: "smooth"});
            }
        }, [history]);

        return (
            <main className="h-screen bg-gray-700 p-6 flex flex-col">
                <div className="flex flex-col gap-8 w-full items-center flex-grow max-h-full">
                    <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-t from-red-600 to-blue-600 to-yellow-600 font-family: New Baskerville ITC;">
                        University of Birmingham Chatbot
                    </h1>
                        <form
                            className="rounded-2xl border-orange-500 border-opacity-5 border lg:w-full flex-grow flex flex-col max-h-full overflow-clip"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url('/images/bg.png')`,
                                backgroundSize: 'cover',
                        }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleClick();
                            }}
                            >
                        <div className="overflow-y-scroll flex flex-col gap-5 p-10 h-full">
                            {history.map((message: Message, idx) => {
                                const isLastMessage = idx === history.length - 1;
                                switch (message.role) {
                                    case "assistant":
                                        return (
                                            <div
                                                ref={isLastMessage ? lastMessageRef : null}
                                                key={idx}
                                                className="flex gap-2"
                                            >
                                                <img
                                                    src="/images/assistant.png"
                                                    className="h-12 w-12 rounded-full"
                                                />
                                                <div
                                                    className="w-auto max-w-xl break-words bg-gray-200 rounded-b-xl rounded-tr-xl text-black p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                                                    <p className="text-base font-medium text-violet-500 mb-2">
                                                        AI assistant
                                                    </p>
                                                    <p className="text-sm font-medium text-black-500 mb-2">
                                                    {message.content}
                                                    </p>
                                                    {message.links && (
                                                        <div className="mt-4 flex flex-col gap-2">
                                                            <p className="text-sm font-medium text-slate-500">
                                                                Sources:
                                                            </p>

                                                            {message.links?.map((link) => {
                                                                return (
                                                                    <a
                                                                        href={link}
                                                                        key={link}
                                                                        className="block w-fit px-2 py-1 text-sm  text-violet-700 bg-violet-100 rounded"
                                                                    >
                                                                        {formatPageName(link)}
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    case "user":
                                        return (
                                            <div
                                                className="w-auto max-w-xl break-words bg-blue-300 rounded-b-xl rounded-tl-xl text-black p-6 self-end shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                                                key={idx}
                                                ref={isLastMessage ? lastMessageRef : null}
                                            >
                                                <p className="text-sm font-medium text-violet-500 mb-2">
                                                    You
                                                </p>
                                                <p className="text-sm font-medium text-black-500 mb-2">
                                                {message.content}
                                                </p>
                                            </div>
                                        );
                                }
                            })}
                            {loading && (
                                <div ref={lastMessageRef} className="flex gap-2">
                                    <img
                                        src="/assistant.png"
                                        className="h-12 w-12 rounded-full"
                                    />
                                    <div
                                        className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tr-xl text-black p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                                        <p className="text-sm font-medium text-violet-500 mb-4">
                                            AI Assistant
                                        </p>
                                        <LoadingDots/>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* input area */}
                        <div className="flex sticky bottom-0 w-full px-6 pb-6 h-24">
                            <div className="w-full relative">
              <textarea
                  aria-label="chat input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="w-full h-full resize-none rounded-full border border-slate-900/10 bg-gray-500 pl-6 pr-24 py-[25px] text-base placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleClick();
                      }
                  }}
              />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClick();
                                    }}
                                    className="flex w-14 h-14 items-center justify-center rounded-full px-3 text-sm  bg-violet-600 font-semibold text-white hover:bg-violet-700 active:bg-violet-800 absolute right-2 bottom-2 disabled:bg-violet-100 disabled:text-violet-400"
                                    type="submit"
                                    aria-label="Send"
                                    disabled={!message || loading}
                                >
                                    <Send/>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        );
    }
