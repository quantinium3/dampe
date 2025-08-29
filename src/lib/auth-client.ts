import { createAuthClient } from "better-auth/react"
import {
    oneTapClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";

export const client = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        oneTapClient({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            promptOptions: {
                maxAttempts: 1
            }
        })
    ],
    fetchOptions: {
        onError(e) {
            if (e.error.status === 429) {
                toast.error("Too many requests. Please try again later.");
            }
        },
    },
})

export const {
    signUp,
    signIn,
    signOut,
    useSession,
} = client;
