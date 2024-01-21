"use client"
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import styles from "@/app/Pages.module.css";
import GitHubImage from '/public/images/GitHubSignIn.png';
import Image from "next/image";

const Login = () => {

    const router = useRouter();
    const [error, setError] = useState("");

    // provides status whether user is authenticated or not
    const {data: session, status: sessionStatus} = useSession();

    useEffect(() => {
        if (sessionStatus == "authenticated") {
            router.replace("/home");
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
        if (!password || password.length < 8) {
            setError("Password is Invalid");
            return;
        }
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password
        })
        console.log("Response from Next Auth route:: ", res);

        if (res?.error) {
            if (res.error === "Error: Your account is not Verified") {
                setError("Your account does not have access. Please check if your account is verified.");
            } else {
                setError("Invalid email or password");
            }
            if (res?.url) router.replace("/");
        } else {
            setError("");
        }
    };

    if (sessionStatus == 'loading') {
        return <h1>Loading...</h1>;
    }

    return (
        sessionStatus != "authenticated" && (
            <div className={styles.pageContainer}>
                <div className="bg-[#212121 p-8rounded shadow-md w-96">
                    <h1 className={styles.pageTitle}>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            className={styles.inputStyle}
                            type="text"
                            placeholder="Email"
                            required
                        />
                        <input
                            className={styles.inputStyle}
                            type="password"
                            placeholder="Password"
                            required
                        />
                        <button
                            type="submit"
                            className={styles.button}
                        >
                            {" "}
                            Sign In
                        </button>
                        <p className="text-red-600 text-[16px] mb-4"> {error && error}</p>
                    </form>

                    <a href="/api/auth/signin/github" className="github-signin">
                        <Image src={GitHubImage} alt="Sign in With GitHub button"
                               width={200}
                               height={50}
                        />
                    </a>

                    <div className="text-center text-gray-500 mt-4">- OR -</div>
                    <Link
                        className="block text-center text-blue-500 hover:underline mt-2"
                        href="/register"
                    >
                        Register Here
                    </Link>

                </div>
            </div>
        )
    );
};

export default Login