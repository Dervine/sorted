import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';

export default NextAuth({
  providers: [
    Credentials({
      async authorize(credentials: { email: string; password: string; }) {
        const client = new MongoClient(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        try {
          await client.connect();
          const db = client.db('soko');
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
        } finally {
          await client.close();
        }
      },
    }),
  ],
  database: process.env.MONGODB_URI,
});
