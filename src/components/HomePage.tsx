"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserId, persistUserId } from "@/lib/utils";


const HomePage = () => {

    const router = useRouter();
    const [userId, setUserId] = useState<string>("");

    /// Fetch and set the user_id
    useEffect(() => {
        const collectId = () => {
            const existing = getUserId();

            if (existing) {
                setUserId(existing);
            } else {
                const newId = persistUserId();
                setUserId(newId);
            }
        }

        collectId();
    }, []);


    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-8 p-4 lg:p-0 relative">

            <div className="text-center">
                <h1 className="text-green-500 text-[18px] lg:text-xl mb-1">&gt;private_chat</h1>
                <h4 className="text-zinc-500 text-[14px] lg:text-base">A private, self distructive chat room</h4>
            </div>

            <div className="w-[90%] lg:w-lg min-h-20 border border-zinc-600/80 bg-zinc-900 space-y-2 p-5 lg:p-8">
                <h4 className="text-zinc-500 text-[14px] lg:text-base">Your identity</h4>
                <input
                    disabled
                    value={userId}
                    className="w-full border border-zinc-600/80 py-3 px-4 bg-zinc-950 text-[14px] lg:text-base disabled:text-zinc-600"
                />
                <button
                    disabled={false}
                    onClick={()=> router.push("/chat-room/12345678")}
                    className="w-full py-3 flex justify-center items-center bg-white text-zinc-800 font-bold mt-2
                    cursor-pointer hover:bg-white/80 transition-colors duration-300 text-[14px] lg:text-base disabled:bg-white/20">
                    {`CREATE SECURE ROOM ${false ? "..." : ""}`}
                </button>

                <div className="my-3 w-full flex items-center text-zinc-600">
                    <div className="w-1/2 h-0.5 border-b border-zinc-700"></div>
                    <span className="mx-3">or</span>
                    <div className="w-1/2 h-0.5 border-b border-zinc-700"></div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2 tex-[#9f071138]">
                    <input
                        disabled
                        value=""
                        placeholder="Enter room id..."
                        className="w-full border border-zinc-600/80 py-3 px-4 bg-zinc-950 text-[14px] lg:text-base disabled:text-zinc-600"
                    />
                    <button
                        className="w-full lg:w-fit whitespace-nowrap py-2.5 px-4 flex justify-center items-center bg-white text-zinc-800 font-bold
                        cursor-pointer hover:bg-white/80 transition-colors duration-300 text-[14px] lg:text-base disabled:bg-white/20">
                        {`JOIN ROOM ${false ? "..." : ""}`}
                    </button>
                </div>
            </div>

            {/* Azure Depths */}
            {/* <div
                className="absolute inset-0 -z-10"
                style={{
                    background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #0d1a36 100%)",
                }}
            /> */}

        </div >
    )
}

export default HomePage