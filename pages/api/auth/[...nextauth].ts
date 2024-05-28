import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import clientPromise from "../../../lib/mongodb";
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    Credentials({
      // @ts-ignore
      async authorize(credentials: { email: string; password: string; }) {

        try {
          const client = await clientPromise;
          const db = client.db("soko");
          const usersCollection = db.collection('users');
          const user = await usersCollection.findOne({ email: credentials.email });

          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return { id: user._id.toString(), email: user.email, name: user.name };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});
