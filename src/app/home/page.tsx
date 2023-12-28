import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import QuestionPrompt from "@/app/components/QuestionPrompt";
import Link from "next/link";

const Homepage = async () => {
    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }

    const bigBoxStyle: React.CSSProperties = {
    border: "2px solid #555",   // Dark grey border
    padding: "20px",
    margin: "10px",
    borderRadius: "10px",
    backgroundColor: "#ccc",    // Light grey background color
    boxShadow: "5px 5px 15px #888",  // 3D box shadow
  };

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <div style={bigBoxStyle}>
                <QuestionPrompt
                    destination="/chatbot"
                    buttonText = "Why should I study at UoB?"
                    message = "Why should I study at UoB?"
                />
            </div>

            <div style={bigBoxStyle}>
                <QuestionPrompt
                    destination="/chatbot"
                    buttonText = "What is life on campus like?"
                    message = "What is life on campus like?"
                />
            </div>

            <div style={bigBoxStyle}>
                <QuestionPrompt
                    destination="/chatbot"
                    buttonText="What are the latest student events at UoB?"
                    message="What are the latest student events at UoB?"
                />
            </div>
        </div>
    )
        ;
};

export default Homepage;
