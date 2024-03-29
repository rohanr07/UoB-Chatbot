// Import necessary modules and components
"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/message";
import { Send } from "react-feather";
import LoadingDots from "@/app/components/LoadingDots";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { questions } from "@/app/components/homePrompt";
import styles from "@/app/Pages.module.css";
import { useRouter } from "next/navigation";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";


// Define the Chatbot component
export default function Chatbot() {
  const { data: session }: any = useSession();
  const [message, setMessage] = useState<string>("");
  //const [likeDislikeClicked, setLikeDislikeClicked] = useState(false);
  const searchParams = useSearchParams();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;


  console.log(" admin Email: ", adminEmail);
  console.log(" Session email", session?.user?.email);

  const [history, setHistory] = useState<Message[]>([
  {
    role: "assistant",
    content: `Hello ${session?.user?.name}! Ask me anything about the University of Birmingham.`,
  },
]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      console.log("User is not authenticated. Redirecting to login page.");
      router.push("/login");
      return;
    } else {
      console.log("USER IS AUTHENTICATED");
    }
  }, []);

  const handleClick = () => {
    if (message === "") return;

    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: message },
    ]);
    setMessage("");
    setLoading(true);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message, history: history }),
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
    const pageName = url.split("/").pop();
    if (pageName) {
      const formattedName = pageName.split("-").join(" ");
      return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  useEffect(() => {
    setMessage(searchParams.get("message") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (questions.includes(message)) {
      handleClick();
    }
  }, [message]);

  const handleLikeDislike = async (
    msg: Message,
    tLikeDislike: boolean
  ) => {
    console.log("Like/Dislike message:", msg);
    console.log("Like for:", tLikeDislike);

    await fetch("/api/chat-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: msg.content,
        likeDislike: tLikeDislike,
      }),
    });

    // Update the likeDislike property for the specific assistant message
    setHistory((oldHistory) =>
      oldHistory.map((m) =>
        m === msg ? { ...m, likeDislike: true } : m
      )
    );
  };

  // Your React component file

const downloadDislikedAnswers = async () => {
  try {
    const response = await fetch('/api/dislike-analytics');
    const responseData = await response.json(); // Parse the JSON response

    if (response.ok) {
      const csvData = responseData.body;

      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });

      // Create a download link and trigger a click
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'disliked_answers.csv';
      link.click();
    } else {
      console.error('Error downloading disliked answers:', responseData);
    }
  } catch (error) {
    console.error('Error downloading disliked answers:', error);
  }
};



  return (
    <main className={styles.pageBackground}>
      <div className={styles.chatbotContainer}>
        <h1 className={styles.pageTitle}>
          University of Birmingham Chatbot
        </h1>

{session?.user?.email === adminEmail && (
    <button
        className={styles.button}
        style={{marginLeft: 'auto'}}
        onClick={downloadDislikedAnswers}
    >
      Download Disliked Answers
    </button>
)}

        <form
            className="rounded-2xl border-orange-500 border-opacity-5 border lg:w-full flex-grow flex flex-col max-h-full overflow-clip"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url('/images/bg.png')`,
              backgroundSize: "cover",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleClick();
            }}
        >
          <div className="overflow-y-scroll flex flex-col gap-5 p-10 h-full">
            {history.map((msg: Message, idx) => {
              const isLastMessage = idx === history.length - 1;
              switch (msg.role) {
                case "assistant":

                  return (
                      <div
                          ref={isLastMessage ? lastMessageRef : null}
                          key={idx}
                          className="flex gap-2"
                      >
                        <img
                            src="/images/assistant.png"
                            alt="Profile picture of the assistant"
                            className="h-12 w-12 rounded-full"
                        />
                        <div
                            className="w-auto max-w-xl break-words bg-gray-200 rounded-b-xl rounded-tr-xl text-black p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                        >
                          <p className="text-base font-medium text-violet-500 mb-4">
                            BrumBot
                          </p>
                          <p className="text-sm font-medium text-black-500 mb-2">
                            {msg.content}
                          </p>
                          {isLastMessage && !msg.likeDislike && msg.role === "assistant" && (
                              <div className="flex justify-end mt-2">
                                {history.length > 1 && (
                                    <>
                                      <button
                                          onClick={() => handleLikeDislike(msg, true)}
                                          style={{
                                            marginRight: "8px",
                                            color: msg.likeDislike ? "gray" : "black",
                                          }}
                                      >
                                        <FaThumbsUp/>
                                      </button>
                                      <button
                                          onClick={() => handleLikeDislike(msg, false)}
                                          style={{
                                            color: msg.likeDislike ? "gray" : "black",
                                          }}
                                      >
                                        <FaThumbsDown/>
                                      </button>
                                    </>
                                )}
                              </div>
                          )}
                          {msg.links && (
                              <div className="mt-4 flex flex-col gap-2">
                                <p className="text-sm font-medium text-slate-500">
                                  Sources:
                                </p>
                                {msg.links?.map((link) => (
                                    <a
                                        href={link}
                                        key={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-fit px-2 py-1 text-sm  text-violet-700 bg-violet-100 rounded"
                                    >
                                      {formatPageName(link)}
                                    </a>
                                ))}
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
                          {msg.content}
                        </p>
                      </div>
                  );
              }
            })}
            {loading && (
                <div ref={lastMessageRef} className="flex gap-2">
                  <img
                      src="/images/assistant.png"
                      alt="Profile picture of the assistant"
                      className="h-12 w-12 rounded-full"
                  />
                  <div
                      className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tr-xl text-black p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                  >
                    <p className="text-sm font-medium text-violet-500 mb-4">
                      BrumBot
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