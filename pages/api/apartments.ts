import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db('soko');
    const apartmentsCollection = db.collection('apartments');
    const apartments = await apartmentsCollection.find({}).toArray();
    res.status(200).json(apartments);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
