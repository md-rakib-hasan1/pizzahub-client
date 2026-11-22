
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing from environment variables");
}

const globalForMongo = globalThis as typeof globalThis & {
    mongoClient?: MongoClient;
};

const client =
    globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClient = client;
}

const db = client.db(process.env.DB_NAME || "pizzahub");

export { client, db };
