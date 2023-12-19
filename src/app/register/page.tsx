"use client";

import React, {useEffect, useState} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {useSession} from "next-auth/react";

const Register = () => {

    const [error, setError] = useState("");
    const router = useRouter();

    const {data: session, status : sessionStatus} = useSession();

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
        const email = e.target[0].value;
        const password = e.target[1].value;

        if (!isValidEmail(email)) {
            setError("Email is Invalid");
            return;
        }

        if(!password || password.length < 8) {
            setError("Password is Invalid");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })

            if (res.status == 400) {
                setError("This email is already registered");
            } if (res.status == 200) {
                // navigating to login page as successfully registered
                setError("");
                router.push("/login")
            }

        } catch (error) {
            setError("Error, try again");
            console.log(error);
        }
    };

    if (sessionStatus == 'loading') {
        return <h1>Loading...</h1>;
    }

    return (
        sessionStatus != "authenticated" && (
        <div className="flex min-h-screen lex-col items-center justify-between p-24">
            <div className="bg-[#212121 p-8rounded shadow-md w-96">
                <h1 className="text-4xl text-center font-semibold mb-8" >Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus: border-blue-400 focus: text-black"
                        placeholder="Name"
                        required
                    />

                    <input
                        type="text"
                        className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus: border-blue-400 focus: text-black"
                        placeholder="Email"
                        required
                    />

                    <input
                        type="password"
                        className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus: border-blue-400 focus: text-black"
                        placeholder="Password"
                        required
                    />

                    <button
                        type="submit"
                        className="w -full bg-blue-500 text-white py-2 rounded hover: bg-blue-600"
                    >
                    {" "}
                        Register
                    </button>

                    <p className="text-red-600 text-[16px] mb-4"> {error && error}</p>

                </form>
                <div className ="text-center text-gray-500 mt-4">- OR -</div>
                <Link
                    className="block text-center text-blue-500 hover:underline mt-2"
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