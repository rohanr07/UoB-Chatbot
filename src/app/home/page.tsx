import React from "react";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import HomePageButtons from "@/app/components/homePageButtons";
import {questions} from "@/app/components/homePrompt"
import styles from '@/app/Pages.module.css'
import Image from 'next/image';
import InstagramLogo from '/public/images/Instagram.png';
import FacebookLogo from '/public/images/Facebook.png';
import LinkedInLogo from '/public/images/Linkedin.png';
import YouTubeLogo from '/public/images/YouTube.png';

const Homepage = async () => {

    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }

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
        <div>
            <div className={styles.containerStyle}>
                <div className={styles.logosContainer}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <Image src={InstagramLogo} alt="Instagram" className={styles.socialMediaLogo}/>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <Image src={FacebookLogo} alt="Facebook" className={styles.socialMediaLogo}/>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <Image src={LinkedInLogo} alt="LinkedIn" className={styles.socialMediaLogo}/>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <Image src={YouTubeLogo} alt="YouTube" className={styles.socialMediaLogo}/>
                    </a>
                </div>

                <div className={styles.columnStyle}>
                    <div className={styles.boxStyle}>
                        <HomePageButtons
                            destination="/chatbot"
                            buttonText={shuffledQuestions[0]}
                            message={shuffledQuestions[0]}
                        />
                    </div>
                    <div className={styles.boxStyle}>
                        <HomePageButtons
                            destination="/chatbot"
                            buttonText={shuffledQuestions[1]}
                            message={shuffledQuestions[1]}
                        />
                    </div>
                </div>
                <div className={styles.columnStyle}>
                    <div className={styles.boxStyle}>
                        <HomePageButtons
                            destination="/chatbot"
                            buttonText={shuffledQuestions[2]}
                            message={shuffledQuestions[2]}
                        />
                    </div>
                    <div className={styles.boxStyle}>
                        <HomePageButtons
                            destination="/chatbot"
                            buttonText={shuffledQuestions[3]}
                            message={shuffledQuestions[3]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

export default Homepage;
