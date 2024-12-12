import { UserRole } from '@deploy/schemas/users';

export interface DbUser {
    id: string,
    createdAt: string
    updateAt: string
    role: UserRole
    name: string
    email: string
    password: string
}