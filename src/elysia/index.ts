import { room } from './room';
import { cors } from '@elysiajs/cors';
import { ApiError } from "@/lib/ApiError";
import { Elysia, NotFoundError } from "elysia";
import { ApiResponse } from "@/lib/ApiResponse";

export const app = new Elysia({ prefix: "/api" })
    
    .use(cors({
        origin: true,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }))

    /// Global Error Handler
    .onError(({ error, set }) => {
        if (error instanceof ApiError) {
            set.status = error.status;
            return ApiResponse(error.status, error.message);
        } else if (error instanceof NotFoundError && error?.code === "NOT_FOUND") {
            return ApiResponse(404, "Api not found!");
        }

        console.error(error);

        set.status = 500;
        return ApiResponse(500, "Internal Server Error");
    })

    /// Modules - These come AFTER CORS
    .use(room)
