import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Account, User as AuthUser } from "next-auth";
import bcrypt from "bcryptjs";
// required to create a new User who log in with GitHub
import User from "@/models/User";
// validating if log-in credentials are registered in the database
import connect from "@/utils/mongodb"

export const authOptions:any = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                name: {label: "Name", type: "text"},
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials: any) {
                await connect();

                try {
                    const user = await User.findOne({email: credentials.email});

                    if (user) {
                        // user exists and can log in using the credentials
                        // checking if password is validated in database

                        if (!user.isVerified) {
                            throw new Error("Your account is not Verified");
                        }

                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        )
                        if (isPasswordCorrect)  {
                            return user;
                        }
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({user, account}: { user: AuthUser, account: Account }) {
            try {
                if (account?.provider == "credentials") {
                    return true;
                }
                if (account?.provider == "github") { // || account?.provider === "google") {
                    await connect();
                    const existingUser = await User.findOne({email: user.email});

                    if (!existingUser) {
                        console.log("New Github user")
                        const newUser = new User({
                            email: user.email,
                            name: user.name,
                            provider: account?.provider
                        });
                        await newUser.save();
                        return true;
                    }
                    return true;
                }
            } catch (err) {
                console.log("Error saving User", err);
                return false;
            }
        },
    },
};


//export default NextAuth(authOptions)
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };




