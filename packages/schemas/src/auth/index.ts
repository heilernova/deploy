export interface ApiAuth {
    role: "admin" | "collaborator";
    name: string;
    token: string;
}

export interface ApiCredentials {
    email: string;
    password: string;
}