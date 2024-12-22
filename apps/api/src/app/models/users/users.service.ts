import { Injectable } from '@nestjs/common';
import { UserRole } from '@deploy/schemas/users';
import { OmitBy } from '@deploy/core';
import { hash } from 'argon2';
import { isUUID } from 'class-validator';
import { DbUser } from './db-user.interface';
import { DbService } from '../../common/db';

@Injectable()
export class UsersService {
    constructor(private readonly _db: DbService){}

    public async get(value: string){
        const conn = await this._db.getConnection();
        const res = await conn.get<DbUser | undefined>(`SELECT * FROM users WHERE ${isUUID(value) ? 'id' : 'email'} = ?`, [value]);
        conn.close();
        return res;
    }

    public async getAll(filter?: { ignore?: string }): Promise<DbUser[]>{
        const con = await this._db.getConnection();
        let list: DbUser[];
        if (filter?.ignore){
            list = await con.all<DbUser[]>("SELECT * FROM users WHERE id <> ?", filter.ignore);
        } else {
            list = await con.all<DbUser[]>("SELECT * FROM users");
        }
        con.close();
        return list;
    }

    public async create(data: { role: UserRole, name: string, email: string }): Promise<DbUser> {
        const user: DbUser = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
            role: data.role,
            name: data.name,
            email: data.email.toLowerCase(),
            password: await hash("admin")
        }
        const conn = await this._db.getConnection();
        const values = Object.values(data);
        const sql = `INSERT INTO users(${Object.keys(data).join(", ")}) VALUES(${Array(values.length).fill('?').join(',')})`;
        await conn.run({ sql, values });
        conn.close();
        return user;
    }

    public async update(id: string, data: Partial<OmitBy<DbUser, "id" | "createdAt" | "updateAt">>){
        const update: Partial<OmitBy<DbUser, "id" | "createdAt">> = {};
        if (data.email) update.email = data.email.toLowerCase();
        if (data.name) update.name = data.name;
        if (data.role) update.role = data.role;
        if (data.password) update.password = await hash(data.password);
        const sql = `UPDATE users SET ${Object.keys(update).map(x => `${x} = ?`).join(", ")} WHERE id = ?`;
        const conn = await this._db.getConnection();
        await conn.run({ sql, values: [...Object.values(update), id] })
        conn.close();
    }

    public async delete(id: string): Promise<void> {
        const conn = await this._db.getConnection();
        await conn.run({ sql: "DELETE FROM users WHERE id = ?", values: [id] });
    }
}
