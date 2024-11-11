import * as sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const getConnection = async () => {
    const db = await open({
        filename: './app.db',
        driver: sqlite3.Database
    })
    return db;
}