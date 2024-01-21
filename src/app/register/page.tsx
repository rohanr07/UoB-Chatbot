"use client";

import React, {useEffect, useState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {useSession} from "next-auth/react";
import styles from '@/app/Pages.module.css'

const Register = () => {

    const [error, setError] = useState("");
    const router = useRouter();

    const {data: session, status: sessionStatus} = useSession();

    useEffect(() => {
        if (sessionStatus == "authenticated") {
            router.replace("/");
        }
    }, [sessionStatus, router])

    const isValidEmail = (email: string) => {
        // validating the email address checking for presence of letters, numbers and "@"
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        if (!isValidEmail(email)) {
            setError("Email is Invalid");
            return;
        }

        if (password.length < 7) {
            setError("Password should be at least 7 characters long");
            return;
        } else if (!/[A-Z]/.test(password)) {
            setError("Password should contain an uppercase character");
            return;
        } else if (!/[a-z]/.test(password)) {
            setError("Password should contain a lowercase character");
            return;
        } else if (!/[0-9]/.test(password)) {
            setError("Password should contain a number");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })

            if (res.status == 400) {
                setError("This email is already registered");
            }
            if (res.status == 200) {
                // navigating to login page as successfully registered
                setError("");
                router.push("/login")
            }

        } catch (error) {
            setError("Error, try again");
            console.log(error);
        }
    };

    if (sessionStatus === 'loading') {
        return (
            <div className="loadingContainer">
                <h1>Loading...</h1>
            </div>
        );
    }


    return (
        sessionStatus != "authenticated" && (
            <div className={styles.pageContainer}>
                <div className={styles.credentialFields}>
                    <h1 className={styles.pageTitle}>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            //className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus: border-blue-400 focus: text-black"
                            className={styles.credentialsPage}
                            placeholder="Name"
                            required
                        />

                        <input
                            type="text"
                            //className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus: border-blue-400 focus: text-black"
                            className={styles.credentialsPage}
                            placeholder="Email"
                            required
                        />

                        <input
                            type="password"
                            //className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus: border-blue-400 focus: text-black"
                            className={styles.credentialsPage}
                            placeholder="Password"
                            required
                        />

                        <button
                            type="submit"
                            className={styles.button}
                        >
                            {" "}
                            Register
                        </button>

                        <br/>
                        <br/>

                        <p className={styles.errorMessage}>
                            <b>Password must contain...</b>
                            <ul>
                                <li>• At least 7 characters</li>
                                <li>• An uppercase character</li>
                                <li>• A lowercase character</li>
                                <li>• A number</li>
                            </ul>
                        </p>


                        <p className={styles.errorMessage}> {error && error}</p>

                    </form>
                    <div className={styles.homeDivider}>- OR -</div>
                    <Link
                        className={styles.loginLink}
                        href="/login"
                    >
                        Login with an existing account
                    </Link>
                </div>
            </div>
        )
    );
};

export default Register