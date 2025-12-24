export interface BaseApiResponse {
    success: boolean
    status_code: number
    message: string
}

export interface CreateRoomApiResponse extends BaseApiResponse {
    data: CreateRoomResponse
}
export interface CreateRoomResponse extends BaseApiResponse {
    id: string
    expiredAt: string
    connected: string[]
}
