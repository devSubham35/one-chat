import { nanoid } from "nanoid";
import { redis } from "./lib/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RoomType = {
    createdAt: number,
    connected: string[],
}

const COOKIE_NAME = "x-auth-token";

export async function proxy(request: NextRequest) {

    const pathname = request.nextUrl.pathname;
    const roomMatch = pathname.match(/^\/chat-room\/([^/]+)$/)

    if (!roomMatch) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    const roomId = roomMatch[1]

    const room = await redis.hgetall<RoomType>(`room:${roomId}`)

    if (!room) {
        return NextResponse.redirect(new URL("/?error=room-not-found", request.url))
    }

    const existingToken = request.cookies.get(COOKIE_NAME)?.value;


    /// Check user already in the room or not
    if (existingToken && room.connected.includes(existingToken)) {
        return NextResponse.next();
    }

    /// Chehck the room is full or not
    if (room.connected?.length >= 2) {
        return NextResponse.redirect(new URL("/?error=room-full", request.url));
    }

    const response = NextResponse.next();
    const token = nanoid(12);


    /// Generate token and add if new user
    response.cookies.set(COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    await redis.hset(`room:${roomId}`, {
        connected: [...room?.connected, token]
    })

    return response;
}


export const config = {
    matcher: "/chat-room/:path*",
};
