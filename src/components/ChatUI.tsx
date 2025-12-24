"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import useRoom from "@/hook/useRoom";
import ChatHeader from "./ChatHeader";
import ChatSection from "./ChatSection";

const ChatUI = () => {

    const [value, setValue] = useState("");
    const { roomId, destroyRoomMutate, isCreateRoomPending, sendMessageMutate } = useRoom();



    const handleSend = () => {
        if (!value.trim()) return;
        sendMessageMutate(value, {
            onSuccess: () => setValue("")
        })
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
