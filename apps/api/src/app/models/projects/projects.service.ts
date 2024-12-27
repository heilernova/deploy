import { Injectable } from '@nestjs/common';
import { DbService } from '../../common/db';
import { IProject, ProjectCreateValues, ProjectUpdateValues } from '@deploy/schemas/projects';
import { DbProjectInterface, DbProjectUpdateValues } from './db-project.interface';

@Injectable()
export class ProjectsService {
    constructor(
        private _db: DbService
    ){}

    private parse(data: DbProjectInterface): IProject {
        return {
            id: data.id,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            deployAt: data.deployAt ? new Date(data.deployAt) : null,
            domain: data.domain,
            name: data.name,
            processName: data.processName,
            version: data.version,
            location: data.location,
            startupFile: data.startupFile,
            framework: data.framework,
            runningOn: data.runningOn,
            runtimeEnvironment: data.runtimeEnvironment,
            url: data.url,
            env: JSON.parse(data.env),
            ignore: JSON.parse(data.ignore),
            observations: data.observation,
            repository: data.repository ? JSON.parse(data.repository) : null,
        }
    }

    public async getAll(): Promise<IProject[]> {
        const conn = await this._db.getConnection();
        const result = await conn.all<DbProjectInterface[]>("SELECT * FROM projects");
        conn.close();
        return result.map(x => this.parse(x));
    }

    public async get(id: string): Promise<IProject | undefined> {
        const conn = await this._db.getConnection();
        const result = await conn.get<DbProjectInterface | undefined>("SELECT * FROM projects WHERE id = ?", [id]);
        conn.close();
        return result ? this.parse(result) : undefined;
    }

    public async create(data: ProjectCreateValues){
        const project: DbProjectInterface = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deployAt: null,
            domain: data.domain.trim(),
            name: data.name.trim(),
            version: data.version ?? null,
            processName: data.processName.trim(),
            startupFile: data.startupFile,
            location: data.location,
            framework: data.framework ?? null,
            runningOn: data.runningOn ?? null,
            runtimeEnvironment: data.runtimeEnvironment ?? null,
            url: data.url ?? null,
            env: data.env ? JSON.stringify(data.env) : '{}',
            ignore: data.ignore ? JSON.stringify(data.ignore) : '[]',
            observation: data.observations ?? null,
            repository: data.repository ? JSON.stringify(data.repository) : null
        }
        const conn = await this._db.getConnection();
        const values = Object.values(project);
        const sql = `INSERT INTO projects(${Object.keys(project).join(", ")}) VALUES(${Array(values.length).fill('?').join(',')});`;
        await conn.run({ sql, values });
        conn.close();
        return project;
    }

    public async update(id: string, data: ProjectUpdateValues){
        const values: DbProjectUpdateValues = {};
        if (data.domain)  values.domain = data.domain.trim();
        if (data.name) values.name = data.name.trim();
        if (data.version) values.version = data.version;
        if (data.processName) values.processName = data.processName.trim();
        if (data.startupFile) values.startupFile = data.startupFile;
        if (data.location) values.location = data.location;
        if (data.framework) values.version = data.version;
        if (data.runningOn) values.runningOn = data.runningOn;
        if (data.runtimeEnvironment) values.runtimeEnvironment = data.runtimeEnvironment;
        if (data.url) values.url = data.url;
        if (data.env) values.env = data.env ? JSON.stringify(data.env) : undefined;
        if (data.ignore) values.ignore = data.ignore ? JSON.stringify(data.ignore) : undefined;
        if (data.observations) values.observation = data.observations;
        if (data.repository) values.repository = data.repository ? JSON.stringify(data.repository) : undefined;

        const sql = `UPDATE projects SET ${Object.keys(values).map(x => `${x} = ?`).join(", ")} WHERE id = ?`;
        const conn = await this._db.getConnection();
        await conn.run({ sql, values: [...Object.values(values), id] })
        conn.close();
    }

    public async delete(id: string){
        const conn = await this._db.getConnection();
        const sql = `DELETE FROM projects WHERE id = ?`;
        await conn.run({ sql, values: [id] })
        conn.close();
    }

    public async isAvailableName(name: string, domain: string, ignore?: string): Promise<boolean> {
        let sql = `SELECT COUNT(*) as count FROM projects WHERE domain = ? AND NAME = ?`;
        const params = [name, domain]
        if (ignore){
            sql += " AND  id <> ?";
            params.push(ignore);
        }
        const conn = await this._db.getConnection();
        const result = await conn.get<{ count: number }>(sql, params);
        conn.close();
        return result?.count == 0;
    }

    public async isAvailableProcessName(processName: string, ignore?: string): Promise<boolean> {
        let sql = `SELECT COUNT(*) as count FROM projects WHERE processName = ?`;
        const params = [processName]
        if (ignore){
            sql += " AND  id <> ?";
            params.push(ignore);
        }
        const conn = await this._db.getConnection();
        const result = await conn.get<{ count: number }>(sql, params);
        conn.close();
        return result?.count == 0;
    }

    public async getPermissions(projectId: string, userId: string): Promise<string[]> {
        const conn = await this._db.getConnection();
        const result = await conn.get<{ permissions: string }>("SELECT a.permissions FROM projects_users a INNER JOINT projects b on a.projectId = b.id WHERE b.id = ? and a.userId = ?", projectId, userId);
        conn.close();
        return result ? JSON.parse(result.permissions) : [];
    }
}
