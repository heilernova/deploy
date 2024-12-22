import { existsSync } from 'node:fs';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { DB_STRUCTURE_BASE } from './db-structure';
import { hash } from 'argon2';

export const initDb = async () => {
    if (existsSync("./app.db")) return;
    const db = await open({ filename: "./app.db", driver: sqlite3.Database});
    let sql = `${DB_STRUCTURE_BASE}`;
    sql += `INSERT INTO users VALUES('${crypto.randomUUID()}', '${(new Date()).toISOString()}', '${(new Date()).toISOString()}', 'admin', 'Administrador', 'admin@admin.com', '${await hash("admin")}');`;
    await db.exec(sql);
    db.close();
}