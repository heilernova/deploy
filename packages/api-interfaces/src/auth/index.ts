export interface AuthCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    role: "admin" | "collaborator";
    name: string;
    token: string;
    permissions: string[];
}