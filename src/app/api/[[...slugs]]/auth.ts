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
    .derive({ as: "scoped" }, async ({ params, query, cookie }) => {

        const roomId = params?.id ?? query?.roomId;
        const token = cookie["x-auth-token"]?.value;

        if (!roomId || !token) {
            throw new ApiError("Missing room id or token", 401);
        }

        const connected = await redis.hget<string[]>(`room:${roomId}`, "connected")

        if (!connected?.includes(String(token))) {
            throw new ApiError("Invalid token", 400);
        }

        return {
            auth: { token, roomId, connected }
        }
    })