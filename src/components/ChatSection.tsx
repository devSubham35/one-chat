"use client";

// import moment from "moment"
import { useEffect, useRef } from "react";

interface ChatSectionProps {
    chats: string[]
}

const ChatSection = ({ chats }: ChatSectionProps) => {

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [chats]);

    return (
        <div
            ref={containerRef}
            className="w-[90%] xl:w-1/2 h-full flex flex-col gap-3 py-4 overflow-y-auto scrollbar-hide pr-2 mb-7"
        >
            {
                [...Array(10)].map((_, index) => {

                    const isSender = false

                    return (
                        <div
                            key={index}
                            className={`
                              rounded-lg px-3 py-2 
                        w-fit max-w-[70%] lg:max-w-[50%] flex flex-col backdrop-blur-sm bg-white/5 border border-white/10
                        text-sm lg:text-base wrap-break-word ${isSender ? "rounded-tl-none self-end" : "rounded-tr-none"}
                            `}
                        >
                            <h1 className={`${isSender ? "text-green-500" : "text-yellow-500"} text-xs mb-1.5`}>
                                userId
                            </h1>
                            <h1 className="text-white">hello</h1>
                            <p className="mt-0.5 text-xs lg:text-xs text-zinc-400 self-end">
                                {/* {moment(534535345345).format("hh:mm")} */}
                                19:35
                            </p>
                        </div>
                    )
                })
            }

        </div>
    );
};

export default ChatSection;
