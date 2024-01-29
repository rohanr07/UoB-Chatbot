"use client";
import React, {useEffect, useState} from "react";
//import {getServerSession} from "next-auth";
import {useRouter} from "next/navigation";
import HomePageButtons from "@/app/components/homePageButtons";
import {questions} from "@/app/components/homePrompt"
import styles from '@/app/Pages.module.css'
import Image from 'next/image';
//import Image from 'next/future/image';
import InstagramLogo from '/public/images/Instagram.png';
import FacebookLogo from '/public/images/Facebook.png';
import LinkedInLogo from '/public/images/Linkedin.png';
import YouTubeLogo from '/public/images/YouTube.png';
import X from '/public/images/X.png';
//import CampusImage from '/public/images/Campus.png';
import {useSession} from "next-auth/react";


const Homepage = () => {

    //const session =  getServerSession();
    const router = useRouter();
    const {data: session}: any = useSession();
    const [shuffledQuestions, setShuffledQuestions] = useState<string[]>([]);

    useEffect(() => {
        if (!session) {
            // Redirect to login page if not signed in
            console.log("User is not authenticated. Redirecting to login page.");
            router.push("/login");
            return;
        } else {
            console.log(" USER IS AUTHENTICATED ");
        }

        setShuffledQuestions(shuffleArray(questions));
    }, [session]);

    const shuffleArray = (array: string[]) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const [showVideo, setShowVideo] = useState(false);

    const loadVideo = () => {
        setShowVideo(true);
    };
    const closeVideo = () => {
        setShowVideo(false);
    };
    return (
        <div className={styles.pageBackground}>
            <h1 className={styles.pageTitle}>
                Hi {session?.user?.name}, Welcome to the University of Birmingham Chatbot
            </h1>
            <ul className={styles.bulletPoints}>
                <li>Provides quick virtual aid for UoB inquiries</li>
                <li>Tailored towards UoB students</li>
                <li>Direct access to UoB resources, events & contacts</li>
                <li>Seamless design ensuring 24/7 information access</li>
            </ul>
            <div>
                <button className={styles.demoButton} onClick={loadVideo}>Demo Clip</button>

                {showVideo && (
                    <>
                        <div className={styles.overlay}></div>
                        <div className={styles.videoContainer}>
                            <button className={styles.closeButton} onClick={closeVideo}>
                                <span className={styles.closeIcon}>X</span>
                            </button>
                            <video width="100%" controls>
                                <source src="/images/BrumBot.mp4" type="video/mp4"/>
                                Your browser does not support videos
                            </video>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.socialMediaContainer}>
                <p className={styles.connectText}>Connect with UoB<br/>on Social Media:</p>

                <a href="https://www.instagram.com/unibirmingham/" target="_blank" rel="noopener noreferrer"
                   title="UoB Instagram">
                    <Image src={InstagramLogo} alt="Instagram" className={styles.socialMediaLogo}/>
                </a>
                <a href="https://www.facebook.com/unibirmingham/" target="_blank" rel="noopener noreferrer">
                    <Image src={FacebookLogo} alt="Facebook" className={styles.socialMediaLogo}/>
                </a>
                <a href="https://www.linkedin.com/school/university-of-birmingham/" target="_blank"
                   rel="noopener noreferrer">
                    <Image src={LinkedInLogo} alt="LinkedIn" className={styles.socialMediaLogo}/>
                </a>
                <a href="https://www.youtube.com/user/unibirmingham" target="_blank" rel="noopener noreferrer">
                    <Image src={YouTubeLogo} alt="YouTube" className={styles.socialMediaLogo}/>
                </a>
                <a href="https://twitter.com/unibirmingham" target="_blank" rel="noopener noreferrer">
                    <Image src={X} alt="Twitter" className={styles.socialMediaLogo}/>
                </a>
            </div>

            <div className={styles.promptContainer}>
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