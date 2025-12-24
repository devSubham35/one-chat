import { client } from "@/lib/client"
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query"

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
        onSuccess: (res)=> {
            router.push(`/chat-room/${res?.data?.roomId}`)
        }
    })

    /// Destroy room
    const { mutate: destroyRoomMutate, isPending: isDestroyRoomPending } = useMutation({
        mutationKey: ["destroy-room"],
        mutationFn: async () => {
            const res = await client?.room?.destroy({ id: roomId }).delete();

            return res?.data
        },
        onSuccess: ()=> {
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