export interface APIUserInfo {
    id: string;
    created_at: string;
    updated_at: string;
    role: "admin" | "collaborator";
    name: string;
    email: string;
    password: string;
}

export interface APIUserBodyCreate {
    role: "admin" | "collaborator";
    name: string;
    email: string;
    password: string;
}

export interface APIUserBodyUpdate {
    role?: "admin" | "collaborator";
    name?: string;
    email?: string;
}

export type APIUserGet = APIUserInfo;
export type APIUserGetAll = APIUserInfo[];