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
        display: 'flex',          // Enable flex container
        justifyContent: 'space-around', // Distribute space around the items
        alignItems: 'flex-end',   // Align items to the end of the container on the cross axis
        height: '100vh',          // Make the container take up the full viewport height
        padding: '0',             // Remove padding
        margin: '0',              // Remove margin
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

    return (
        <div style={containerStyle}>
            <div style={columnStyle}>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {questions[0]}
                        message = {questions[0]}
                    />
                </div>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {questions[1]}
                        message = {questions[1]}
                    />
                </div>
            </div>
            <div style={columnStyle}>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {questions[2]}
                        message = {questions[2]}
                    />
                </div>
                <div style={boxStyle}>
                    <HomePageButtons
                        destination="/chatbot"
                        buttonText = {questions[3]}
                        message = {questions[3]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Homepage;
