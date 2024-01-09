import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomePageButtons from "@/app/components/homePageButtons";
import { questions } from "@/app/components/homePrompt"


const Homepage = async () => {

    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 'calc(100vh - 200px)',
        padding: '0',
        margin: '0',
        boxSizing: 'border-box'
    };

    const columnStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '50%',
        alignItems: 'center',
    };

    const boxStyle: React.CSSProperties = {
        border: "2px solid #555",
        padding: "10px",
        margin: "7px 0",
        borderRadius: "25px",
        backgroundColor: "#ccc",
        boxShadow: "5px 5px 7px #888",
        width: '90%',
        boxSizing: 'border-box',
    };

    const shuffleArray = (array: string[]) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

const shuffledQuestions = shuffleArray(questions.slice());

    return (
        <div style={containerStyle}>
            <div style={columnStyle}>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {shuffledQuestions[0]}
                        message = {shuffledQuestions[0]}
                    />
                </div>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {shuffledQuestions[1]}
                        message = {shuffledQuestions[1]}
                    />
                </div>
            </div>
            <div style={columnStyle}>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {shuffledQuestions[2]}
                        message = {shuffledQuestions[2]}
                    />
                </div>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {shuffledQuestions[3]}
                        message = {shuffledQuestions[3]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Homepage;
