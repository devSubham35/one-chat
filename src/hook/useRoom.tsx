import { ApiError } from "@/lib/ApiError";
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation";

const useRoom = () => {

    const router = useRouter();
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
        createRoomMutate,
        isCreateRoomPending,
        destroyRoomMutate,
        isDestroyRoomPending
    }
}

export default useRoom