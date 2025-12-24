import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "x-auth-token";

export async function proxy(request: NextRequest) {
    
    // const pathname = request.nextUrl.pathname;
    // const roomId = pathname.split("/")[2];

    const response = NextResponse.next();
    let token = request.cookies.get(COOKIE_NAME)?.value;


    // if (!room) {
    //     return NextResponse.redirect(
    //         new URL("/?error=room-not-found", request.url)
    //     );
    // }

    /// Generate token if missing
    if (!token) {
        token = nanoid(12);
        response.cookies.set(COOKIE_NAME, token, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
    }

    return response;
}


export const config = {
    matcher: "/chat-room/:path*",
};
