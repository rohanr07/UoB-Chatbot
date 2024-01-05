"use client";
import React from 'react'
import Link from 'next/link';
import { useSession } from "next-auth/react";

import Image from 'next/image';
import MyImage from '/public/images/UoB_Logo.png';

import SettingsDropdown from '@/app/components/Settings';

import styles from '@/app/Navbar.module.css'

const Navbar = () => {
    const {data: session} : any = useSession();

    return (
        <div className={styles.navbar}>
            <ul className="flex justify-between m-10 item-center">
                <div>
                    <a href="https://www.birmingham.ac.uk/index.aspx" target="_blank">
                        <Image src={MyImage} alt="University of Birmingham Logo" />
                    </a>
                </div>

                <div className="flex gap-10 items-center">
                    {!session ? (
                        <>
                                <Link href="/">
                                    <li>Home</li>
                                </Link>

                            <Link href="/login">
                                <li>Login</li>
                            </Link>

                            <Link href="/register">
                                <li>Register</li>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/home">
                            <li>Home</li>
                            </Link>

                            <Link href="/chatbot">
                                <li>Chatbot</li>
                            </Link>

                            <Link href="/history">
                                <li>Chat History</li>
                            </Link>

                            <Link href="/contact">
                                <li> Help </li>
                            </Link>

                            <div className="flex justify-end m-10 item-right gap-8">
                                {session.user.name}
                                <li>
                                    <SettingsDropdown />
                                </li>
                            </div>
                        </>
                    )}

                </div>
            </ul>
        </div>
    );
};

export default Navbar







