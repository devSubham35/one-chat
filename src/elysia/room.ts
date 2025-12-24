import { Elysia } from "elysia";
// import { ApiError } from "@/lib/ApiError";
// import { ApiResponse } from "@/lib/ApiResponse";


export const room = new Elysia({ prefix: "/room" })

    ///////////////////////////////////
    /// Create Room ( Public )
    ///////////////////////////////////

    .post('/create',
        async () => {
            // const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            // throw new ApiError("Room not found!", 404);
            // return ApiResponse(200, "Room created Succesfully!", room);
        }
    )
