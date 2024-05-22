import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const client = await clientPromise;
    const db = client.db("soko");
    const apartmentsCollection = db.collection('apartments');
    const apartments = await apartmentsCollection.find({}).toArray();
    res.status(200).json(apartments);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
