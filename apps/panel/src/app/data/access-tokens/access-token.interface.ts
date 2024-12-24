export interface IAccessToken {
    id: string,
    createdAt: Date,
    type: "web" | "cli",
    hostname: string,
    ip: string,
    device: string,
    platform: string,
    exp: Date | null
}