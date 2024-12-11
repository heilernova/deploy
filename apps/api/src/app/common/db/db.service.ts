import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

@Injectable()
export class DbService {

    public getConnection(){
        return open({ filename: "./app.db", driver: sqlite3.Database});
    }
}
