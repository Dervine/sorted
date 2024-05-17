import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { MongoClient } from 'mongodb';

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = new MongoClient(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        try {
          await client.connect();
          const db = client.db('soko');
          const usersCollection = db.collection('users');
          const user = await usersCollection.findOne({
            email: credentials.email,
            password: credentials.password,
            apartment: credentials.apartment,
          });

          if (user) {
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
