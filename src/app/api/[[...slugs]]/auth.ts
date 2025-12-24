import Elysia from "elysia"
import { redis } from "@/lib/redis";
import { ApiError } from "@/lib/ApiError";


export const authMiddleware = new Elysia({
    name: "auth"
})
    .error({ ApiError })
    .onError(({ error, set }) => {
        if (error instanceof ApiError) {
            set.status = error.status;
            return {
                error: error.message
            };
        }

        /// fallback
        set.status = 500;
        return {
            error: "Internal Server Error - from auth middleware"
        };
    })
    .derive({ as: "scoped" }, async ({ query, cookie }) => {
        const roomId = query.roomId
        const token = cookie["x-auth-token"].value as string | undefined

        console.log(roomId, "++66")

        if (!roomId || !token) {
            throw new ApiError("Missing roomId or token.", 400)
        }

        const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected")

        if (!connected?.includes(token)) {
            throw new ApiError("Invalid token", 400)
        }

        return { auth: { roomId, token, connected } }
    })