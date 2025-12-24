import Elysia from "elysia"
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

        // if (!roomId || !token) {
        //     throw new ApiError("Missing room id or token", 401);
        // }


        // const existingRoom = await prisma.room.findUnique({ where: { id: roomId } });

        // if (!existingRoom) {
        //     throw new ApiError("Room not found", 404, "AuthError");
        // }

        // if (!existingRoom?.connected.includes(token)) {
        //     throw new ApiError("Invalid token", 401, "AuthError");
        // }

        return {
            auth: { token, roomId }
        }
    })