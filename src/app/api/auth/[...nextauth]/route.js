import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"


const handler =  NextAuth({
  secret: process.env.GOOGLE_SECRET,
  providers: [
    // OAuth authentication providers
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
    // Sign in with passwordless email link
  ],
});

export { handler as GET, handler as POST };