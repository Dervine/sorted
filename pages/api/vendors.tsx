import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("soko");

        // Fetch all available categories
        const categories = await db.collection("categories").find({}).toArray();

        // Initialize an object to store vendors and products per category
        const vendorsByCategory: Record<string, any[]> = {};

        // Iterate through each category
        for (const category of categories) {
            // Find vendors selling products in the current category
            const vendorProductMappings = await db.collection("vendor_product_mapping")
                .find({ category: category._id })
                .toArray();

            // Initialize an array to store vendors and their associated products
            const vendorsWithProducts: any[] = [];

            // Iterate through each vendor-product mapping
            for (const mapping of vendorProductMappings) {
                // Find vendor details
                const vendor = await db.collection("vendors")
                    .findOne({ _id: mapping.vendor });

                // Find product details
                const products = await db.collection("products")
                    .findOne({ _id: mapping.product });

                // Add vendor and product details to the array
                vendorsWithProducts.push({
                    vendor,
                    products
                });
            }

            // Add the array of vendors with products to the object
            vendorsByCategory[category.name] = vendorsWithProducts;
        }

        // Send the response with vendors grouped by category
        res.json(vendorsByCategory);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
