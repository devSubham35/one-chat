import z from "zod/v4"
import { redis } from "./redis"
import { Realtime, InferRealtimeEvents } from "@upstash/realtime"

const schema = {
  chat: {
    message: z.object({
        id: z.string(),
        text: z.string(),
        token: z.string(),
        sender: z.string(),
        roomId: z.string(),
        timestamp: z.number(),
    }),
    destroy: z.object({
        isdestroyed: z.literal(true),
    }),
  },
}

export const realtime = new Realtime({ schema, redis })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>