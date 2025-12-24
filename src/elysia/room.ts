import { nanoid } from "nanoid";
import { Elysia } from "elysia";
import { redis } from "@/lib/redis";
import { ApiError } from "@/lib/ApiError";
import { ApiResponse } from "@/lib/ApiResponse";

const ROOM_TTL_DURATION = 60 * 10

export const room = new Elysia({ prefix: "/room" })

    ///////////////////////////////////
    /// Create Room ( Public )
    ///////////////////////////////////

    .post('/create',
        async () => {

            const roomId = nanoid();

            await redis.hset(`room:${roomId}`, {
                connected: [],
                createdAt: Date.now(),
            });

            await redis.expire(`room:${roomId}`, ROOM_TTL_DURATION)

            return ApiResponse(200, "Room created successfully!", { roomId });
        }
    )

    ///////////////////////////////////
    /// Destroy Room ( Public )
    ///////////////////////////////////

    .delete('/destroy/:id',
        async ({ params: { id } }) => {

            if (!id) {
                throw new ApiError("Room ID required!", 400);
            }

            await redis.del(`room:${id}`)

            return ApiResponse(200, "Room destroyed successfully!");
        }
    )
