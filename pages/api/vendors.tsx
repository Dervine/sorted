import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("soko");
        const vendors = await db
            .collection("vendors")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        res.json(vendors);
    } catch (e) {
        console.error(e);
    }
}