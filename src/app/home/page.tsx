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
        height: 'calc(100vh - 200px)', //height: `calc(100vh - ${navBarHeight}px)`,
        padding: '0',
        margin: '0',
        boxSizing: 'border-box'
    };

    const columnStyle: React.CSSProperties = {
        display: 'flex',          // Enable flex container
        flexDirection: 'column',  // Arrange items in a column
        justifyContent: 'flex-end', // Align items to the end of the container (bottom)
        width: '50%',             // Take up half of the container width
        alignItems: 'center',     // Center items on the cross axis
    };

    const boxStyle: React.CSSProperties = {
        border: "2px solid #555",     // Dark grey border
        padding: "10px",
        margin: "7px 0",              // Only add vertical margin
        borderRadius: "25px",
        backgroundColor: "#ccc",      // Light grey background color
        boxShadow: "5px 5px 7px #888",// 3D box shadow
        width: '90%',                 // Width slightly less than the container to account for padding
        boxSizing: 'border-box',      // Include padding and border in the element's total width
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
