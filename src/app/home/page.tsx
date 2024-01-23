import React from "react";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
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
import CampusImage from '/public/images/Campus.png';


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
        <div className={styles.pageBackground}>
            <h1 className={styles.pageTitle}>
                Hi {session?.user?.name}, Welcome to the University of Birmingham Chatbot
            </h1>

            <div className={styles.aboutTextbox}>
                {/*UoB Academic Inquiry Hub<br/>*/}
                <div className={styles.homePageMiniTitle}> About</div>
                • Quick virtual aid for UoB inquiries<br/>
                • Instant responses to student and staff questions<br/>
                • Direct access to UoB resources, events & contacts<br/>
                • Seamless design ensuring 24/7 information access<br/>

            </div>

            <video width="850" controls>
                <source src="/images/BrumBot.mp4" type="video/mp4"/>
                Your browser does not support videos
            </video>


            <div className={styles.socialMediaContainer}>
                <a href="https://www.instagram.com/unibirmingham/" target="_blank" rel="noopener noreferrer">
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

            <div className={styles.logosContainer}>
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
