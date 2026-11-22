import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "./mongodb";
import { jwt } from "better-auth/plugins";


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

    database: mongodbAdapter(db, {
        client,
    }),

    plugins: [jwt()],

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
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

            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },

            subscriptionPlan: {
                type: ["free", "premium"],
                required: false,
                defaultValue: "free",
                input: false,
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