import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"
import { getUserByEmail, createUser } from "@/lib/models/user"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        const client = await clientPromise
        const db = client.db(process.env.MONGODB_DB)

        // Check if user exists in our database
        const dbUser = await getUserByEmail(user.email as string, db)

        if (dbUser) {
          // User exists, update their info
          token.role = dbUser.role
          token.id = dbUser._id.toString()
        } else {
          // Create new user
          const newUser = {
            name: user.name,
            email: user.email as string,
            image: user.image,
            role: "user", // Default role
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          const userId = await createUser(newUser, db)
          token.role = "user"
          token.id = userId.toString()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
