import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: ['customer', 'vendor', 'admin'],
                required: false,
                defaultValue: 'customer',
                input: false,
            },

            accountType: {
                type: ['customer', 'vendor'],
                required: false,
                defaultValue: 'customer',
                input: true,
            },
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const role = user.accountType === 'vendor'
                        ? 'vendor'
                        : 'customer';

                    return {
                        data: {
                            ...user,
                            role,
                        },
                    };
                },
            },
        },
    },
});