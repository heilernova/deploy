export interface DbToken {
    id: string;
    createdAt: string;
    userId: string;
    type: "cli" | "web";
    hostname: string;
    ip: string;
    device: string;
    platform: string | null;
    exp: string | null
}