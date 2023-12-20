import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { Account, User as AuthUser } from "next-auth";
import bcrypt from "bcryptjs";
// required to create a new User who log in with GitHub
import User from "@/models/User";
// validating if log-in credentials are registered in the database
import connect from "@/utils/db"

export const authOptions:any = {
  // Configure one or more authentication providers
  providers: [
      CredentialsProvider({
          id: "credentials",
          name: "Credentials",
          credentials: {
              name: { label: "Name", type: "text" },
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
                      const isPasswordCorrect = await bcrypt.compare(
                          credentials.password,
                          user.password
                      )
                      if (isPasswordCorrect) {
                          console.log(" debug new field name ",user.name);
                          return user;
                      }
                  }
              } catch (err: any) {
                  throw new Error (err);
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
      async signIn({user, account}: {user: AuthUser, account: Account}) {
          if (account?.provider == "credentials") {
              return true;
          }
          if (account?.provider == "github") {
              // logic of storing the data in the database
              await connect();

              try {
                  const existingUser = await User.findOne({email: user.email});
                  if (!existingUser) {
                      // existing user does not exist so will save in the database
                      const newUser = new User({
                          email: user.email
                      });
                      await newUser.save();
                      return true;
                  }
                  return true;

              } catch (err) {
                  console.log("Error saving User", err);
                  return false;
              }
          }
      }
    }
}

//export default NextAuth(authOptions)
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };




