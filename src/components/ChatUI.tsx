"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import useRoom from "@/hook/useRoom";
import ChatHeader from "./ChatHeader";
import ChatSection from "./ChatSection";
// import { getUserId } from "@/lib/utils";
// import { useParams } from "next/navigation";

const ChatUI = () => {

    // const userId = getUserId();
    const [value, setValue] = useState("");
    const { roomId, destroyRoomMutate, isCreateRoomPending } = useRoom();



    const handleSend = () => {
        if (!value.trim()) return;
        console.log(value, "++66 Message")
        setValue("");
    };


    return (
        <div className="w-full h-screen relative z-50">
            <ChatHeader
                roomId={roomId}
                isConnected={true}
                handleDestroyRoom={destroyRoomMutate}
                isDestroyRoomPending={isCreateRoomPending}
            />

            <div className="w-full h-[calc(100vh-205px)] flex justify-center items-center overflow-hidden">
                <ChatSection chats={[]} />
            </div>

            <ChatInput
                value={value}
                handleSend={handleSend}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
};

export default ChatUI;
