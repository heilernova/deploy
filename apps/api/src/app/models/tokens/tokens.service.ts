import { Injectable } from '@nestjs/common';
import { DbService } from '../../common/db';
import { DbToken } from './db-tokens';

@Injectable()
export class TokensService {
    constructor(
        private _db: DbService
    ){}

    private parse(data: DbToken){
        return {
            id: data.id,
            createdAt: new Date(data.createdAt),
            userId: data.userId,
            type: data.type,
            hostname: data.hostname,
            ip: data.ip,
            device: data.device,
            platform: data.platform,
            exp: data.exp ? new Date(data.exp) : null
        }
    }

    public async create(data: { userId: string, type: "cli" | "web", hostname: string, ip: string, device: string, platform: string | null, exp: Date | null }){
        const token: DbToken = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            userId: data.userId,
            type: data.type,
            hostname: data.hostname,
            ip: data.ip,
            device: data.device,
            platform: data.platform,
            exp: data.exp ? data.exp.toISOString() : null
        }
        const conn = await this._db.getConnection();
        const values = Object.values(token);
        const sql = `INSERT INTO project(${Object.keys(data).join(", ")}) VALUES(${Array(values.length).fill('?').join(',')});`;
        await conn.exec({ sql, values });
        conn.close();
        return this.parse(token);
    }

    public async getAll(filter: { userId?: string }){
        let sql = "SELECT * FROM users_tokens";
        const params: string[] = [];
        if (filter.userId){
            sql += " WHERE userId = ?";
            params.push(filter.userId);
        }
        const conn = await this._db.getConnection();
        const result = await conn.all<DbToken[]>({ sql, values: params });
        conn.close();
        return result.map(x => this.parse(x));
    }

    public async get(id: string){
        const sql = "SELECT * FROM users_tokens WHERE id = ?";
        const conn = await this._db.getConnection();
        const result = await conn.get<DbToken | undefined>({ sql, values: [id] });
        conn.close();
        return result ? this.parse(result) : undefined;
    }

    public async update(id: string, values: { exp?: Date | null, ip?: string }){
        const update: { [key: string]: string | null } = {}
        if (values.exp !== undefined) update["exp"] = values.exp ? values.exp.toISOString() : null;
        if (values.ip) update["ip"] = values.ip;
    }
}
