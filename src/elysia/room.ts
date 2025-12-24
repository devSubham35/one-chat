import { nanoid } from "nanoid";
import { Elysia, t } from "elysia";
import { redis } from "@/lib/redis";
import { ApiError } from "@/lib/ApiError";
import { ApiResponse } from "@/lib/ApiResponse";
import { authMiddleware } from "@/app/api/[[...slugs]]/auth";
import { realtime } from "@/lib/realtime";

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
    /// Send msg ( Protected )
    ///////////////////////////////////

    .use(authMiddleware)

    .post('/message',
        async ({ body, auth }) => {

            const existingRoom = await redis.exists(`room:${auth?.roomId}`)

            if (!existingRoom) {
                throw new ApiError("Room not found!", 400);
            }

            const message = {
                id: nanoid(),
                text: body?.text,
                sender: body?.sender,
                roomId: auth?.roomId,
                timestamp: Date.now(),
                token: String(auth?.token),
            }

            /// Pushed msg to redis
            await redis.rpush(`message:${auth?.roomId}`, {
                ...message,
                token: auth?.token
            })

            /// Emit the msg
            await realtime.channel(auth?.roomId).emit("chat.message", message)

            /// Calculate remaining time
            const remaining = await redis.ttl(`message:${auth?.roomId}`);

            /// Update msg expire time
            await redis.expire(`message:${auth?.roomId}`, remaining)
            await redis.expire(`history`, remaining)
            await redis.expire(auth?.roomId, remaining)

            return ApiResponse(200, "message sent successfully!");
        },
        {
            body: t.Object({
                text: t.String(),
                sender: t.String(),
            })
        }
    )

    ///////////////////////////////////
    /// Destroy Room ( Protected )
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
