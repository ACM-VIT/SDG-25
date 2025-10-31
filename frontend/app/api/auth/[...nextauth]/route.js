import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) token.accessToken = account.access_token

      if (user) {
        token.id = user.id
        token.email = user.email ?? token.email ?? null
        if (typeof user.role !== "undefined") {
          token.role = user.role
          token.roleResolved = true
        }
      }

      if (typeof token.role !== "undefined" && typeof token.roleResolved === "undefined") {
        token.roleResolved = true
      }

      if (!token.roleResolved && (token.email || user?.email)) {
        try {
          const client = await clientPromise
          const db = client.db()
          const existingUser = await db
            .collection("users")
            .findOne({ email: token.email ?? user?.email }, { projection: { role: 1 } })

          token.role = existingUser?.role ?? null
          token.roleResolved = true
        } catch (err) {
          console.error("jwt role resolution error", err)
          token.roleResolved = false
        }
      }

      if (typeof token.role === "undefined") token.role = null

      return token
    },

    async session({ session, token }) {
      session.accessToken = token?.accessToken ?? null
      session.user = session.user ?? {}
      session.user.id = token?.id ?? token?.sub ?? null
      session.user.role = token?.role ?? session.user.role ?? null
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
