import { client } from "@/lib/client"
import { ApiError } from "@/lib/ApiError";
import { useMutation } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation";
import { getUserId } from "@/lib/utils";

const useRoom = () => {

    const router = useRouter();
    const userId = getUserId();
    const { roomId } = useParams<{ roomId: string }>();

    /// create Room
    const { mutate: createRoomMutate, isPending: isCreateRoomPending } = useMutation({
        mutationKey: ["create-room"],
        mutationFn: async () => {
            const res = await client?.room?.create.post();

            return res?.data
        },
        onSuccess: (res) => {
            router.push(`/chat-room/${res?.data?.roomId}`)
        }
    })

    /// Send Message
    const { mutate: sendMessageMutate } = useMutation({
        mutationKey: ["send-message"],
        mutationFn: async (text: string) => {
            const res = await client?.room?.message.post({
                text,
                sender: userId,
            });

            if (res?.error) {
                throw new ApiError(
                    res?.error?.value?.message ?? "Something went wrong",
                    res?.error?.status ?? 500
                );
            }

            return res?.data
        }
    })

    /// Destroy room
    const { mutate: destroyRoomMutate, isPending: isDestroyRoomPending } = useMutation({
        mutationKey: ["destroy-room"],
        mutationFn: async () => {
            const res = await client?.room?.destroy({ id: roomId }).delete();

            if (res?.error) {
                throw new ApiError(
                    res?.error?.value?.message ?? "Something went wrong",
                    res?.error?.status ?? 500
                );
            }

            return res?.data
        },
        onSettled: () => {
            router.push(`/`)
        }
    })

    return {
        roomId,
        sendMessageMutate,
        createRoomMutate,
        isCreateRoomPending,
        destroyRoomMutate,
        isDestroyRoomPending
    }
}

export default useRoom