"use client";

import { formatTime } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


type RoomDetails = {
    id: string;
    connected: string[];
    expiredAt: Date | null;
}
interface ChatHeaderProps {
    isConnected?: boolean,
    isDestroyRoomPending?: boolean,
    roomDetails?: RoomDetails | undefined,
    handleDestroyRoom: (roomId: string) => void,
}

const ChatHeader = ({ isConnected, roomDetails, handleDestroyRoom, isDestroyRoomPending }: ChatHeaderProps) => {

    const { roomId } = useParams<{ roomId: string }>();


    const [copyText, setCopyText] = useState("COPY");
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/chat-room/${roomId}`
            );
            setCopyText("COPIED!");
            setTimeout(() => setCopyText("COPY"), 1500);
        } catch (err) {
            console.error("Clipboard error:", err);
        }
    }, [roomId]);


    useEffect(() => {
        if (!roomDetails?.expiredAt) return;

        const expiryTime = Number(roomDetails.expiredAt);

        const interval = setInterval(() => {
            const diffInSeconds = Math.max(
                Math.floor((expiryTime - Date.now()) / 1000),
                0
            );

            setTimeLeft(diffInSeconds);

            if (diffInSeconds === 0) {
                clearInterval(interval);
                handleDestroyRoom(roomId);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [roomDetails?.expiredAt, roomId, handleDestroyRoom]);;


    return (
        <div className="
            w-full border-b border-zinc-700 bg-zinc-900/60 
            flex flex-col lg:flex-row lg:items-center lg:justify-between 
            px-4 sm:px-6 md:px-10 lg:px-16 py-4 gap-4 lg:gap-0
        ">
            {/* ROOM ID */}
            <div>
                <h4 className="text-zinc-500 text-sm sm:text-base">Room ID</h4>
                <div className="flex items-center gap-2">
                    <h4 className="text-green-500 text-[14px] sm:text-[16px] break-all whitespace-nowrap">
                        {roomId}
                    </h4>
                    <button
                        onClick={handleCopy}
                        className="
                                px-3 sm:px-4 py-1.5 bg-zinc-500/50 hover:bg-zinc-500/40 
                                font-semibold cursor-pointer text-[11px] sm:text-[12px] 
                                rounded-lg active:scale-95 transition-transform
                                "
                    >
                        {copyText}
                    </button>
                </div>
            </div>

            {/* SEPARATOR (hidden on small screens) */}
            <div className="hidden lg:block w-0.5 h-10 bg-zinc-500/50 mx-8" />


            <div className="flex items-center justify-between w-full">
                {/* TIMER */}
                <div>
                    <h4 className="text-zinc-500 text-sm sm:text-base">Self_Destruct</h4>
                    <h4 className="text-yellow-500 text-[14px] sm:text-[16px]">
                        {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
                    </h4>
                </div>

                <div className="w-fit flex items-center gap-4">

                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg
                        ${isConnected ? "text-green-600 bg-green-500/15" : "text-red-500 bg-red-500/15"}`}>
                        <div className={`size-2 rounded-full ${isConnected ? "bg-green-600" : "bg-red-500"}`}>
                        </div>
                        <h1 className="text-sm">{isConnected ? "Connected" : "Disconnected"}</h1>
                    </div>


                    {/* DESTROY BUTTON */}
                    <button
                        disabled={isDestroyRoomPending}
                        onClick={() => handleDestroyRoom(roomId)}
                        className="w-fit sm:w-auto px-4 py-2.5 bg-zinc-800 rounded-lg text-red-500
                    text-sm hover:bg-zinc-800/80 cursor-pointer active:scale-95 transition-transform whitespace-nowrap disabled:bg-white/20"
                    >
                        {`💣 DESTROY NOW ${isDestroyRoomPending ? "..." : ""}`}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ChatHeader;
