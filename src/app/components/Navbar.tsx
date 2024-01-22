"use client";
import React from 'react'
import Link from 'next/link';
import {useSession} from "next-auth/react";
import Image from 'next/image';
import MyImage from '/public/images/UoB_Logo.png';
import SettingsDropdown from '@/app/components/Settings';
import styles from '@/app/Navbar.module.css'
import {ThemeSwitcher} from '@/app/components/ThemeSwitcher';

const Navbar = () => {
    const {data: session}: any = useSession();

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <a href="https://www.birmingham.ac.uk/index.aspx" target="_blank">
                    <Image src={MyImage} alt="University of Birmingham Logo"/>
                </a>
            </div>

            <ul className={styles.navLinks}>
                {!session ? (
                    <>
                        <li><ThemeSwitcher/></li>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/login">Login</Link></li>
                        <li><Link href="/register">Register</Link></li>
                    </>
                ) : (
                    <>
                        <li><ThemeSwitcher/></li>
                        <li><Link href="/home">Home</Link></li>
                        <li><Link href="/chatbot">Chatbot</Link></li>
                        <li><Link href="/history">Chat History</Link></li>
                        <li><Link href="/contact">Help</Link></li>
                    </>
                )}
            </ul>

            {session && (
                <div className={styles.userSettings}>
                    <SettingsDropdown/>
                </div>
            )}
        </div>
    );
};

export default Navbar;







