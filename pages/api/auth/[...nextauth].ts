import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import clientPromise from "../../../lib/mongodb";

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

          if (user && user.password === credentials.password) {
            return Promise.resolve(user);
          } else {
            return Promise.resolve(null);
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
});
