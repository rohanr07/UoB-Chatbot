"use client";
import React from 'react'
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";

import Image from 'next/image';
import MyImage from '/public/images/UoB_Logo.png';

import SettingsDropdown from '@/app/components/Settings';

const Navbar = () => {
    const {data: session} : any = useSession();

    return (
        <div>
            <ul className="flex justify-between m-10 item-center">
                <div>
                    <a href="https://www.birmingham.ac.uk/index.aspx" target="_blank">
                        <Image src={MyImage} alt="University of Birmingham Logo" />
                    </a>
                </div>

                <div>
                    <Link href="/">
                        <li>🏠</li>
                    </Link>

                </div>
                <div className="flex gap-10">
                    {!session ? (
                        <>
                            <Link href="/login">
                                <li>Login</li>
                            </Link>

                            <Link href="/register">
                                <li>Register</li>
                            </Link>
                        </>
                    ): (
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

                            {session.user.name}

                            <li>
                                <SettingsDropdown />
                            </li>
                        </>
                    )}

                </div>
            </ul>
        </div>
    );
};

export default Navbar







