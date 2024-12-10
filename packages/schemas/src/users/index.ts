import { ConvertDateToString, OmitBy, PartialBy } from "@deploy/core";

export const USER_ROLE = ["admin", "collaborator"] as const;
export const USER_STATUS = ["active", "inactive", "lock"] as const;

export type UserRole = typeof USER_ROLE[number];
export type UserStatus = typeof USER_STATUS;

export interface IUser {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    status: UserStatus;
    name: string;
    lastName: string;
    email: string;
    password: string;
    permissions: string[];
}


  
export type UserCreateValues = PartialBy<OmitBy<IUser, "id" | "createdAt" | "updatedAt">, "role" | "password" | "permissions">;
export type UserUpdateVAlues = OmitBy<IUser, "id" | "createdAt">;

export type ApiUser = ConvertDateToString<OmitBy<IUser, "password">>