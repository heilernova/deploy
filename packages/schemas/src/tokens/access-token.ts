export interface ApiAccessToken {
    id: string,
    createdAt: string,
    type: "web" | "cli",
    hostname: string,
    ip: string,
    device: string,
    platform: string,
    exp: null | string
}