import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("soko");
        const categories = await db
            .collection("categories")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        res.json(categories);
    } catch (e) {
        console.error(e);
    }
}