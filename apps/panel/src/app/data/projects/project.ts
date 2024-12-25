import { ApiProject, IProject, ProjectStatus } from '@deploy/schemas/projects';
export class Project implements IProject {
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly deployAt: Date | null;
    public readonly domain: string;
    public readonly name: string;
    public readonly processName: string;
    public readonly version: string | null;
    public readonly location: string;
    public readonly startupFile: string;
    public readonly framework: 'NestJS' | 'Angular' | 'FastAPI' | null;
    public readonly runningOn: 'PM2' | 'Docker' | 'LiteSpeed' | 'Apache' | null;
    public readonly runtimeEnvironment: 'Node.js' | 'Python' | 'PHP' | null;
    public readonly url: string | null;
    public readonly repository: { type: 'git'; url: string; } | null;
    public readonly env: { [key: string]: string; };
    public readonly ignore: string[];
    public readonly observations: string | null;
    public readonly status: ProjectStatus;

    constructor(data: ApiProject){
        this.id = data.id;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.deployAt = data.deployAt  ? new Date(data.deployAt) : null;
        this.domain = data.domain;
        this.name = data.name;
        this.processName = data.processName;
        this.version = data.version;
        this.location = data.location;
        this.startupFile = data.startupFile;
        this.framework = data.framework;
        this.runningOn = data.runningOn;
        this.runtimeEnvironment = data.runtimeEnvironment;
        this.url = data.url;
        this.repository = data.repository;
        this.env = data.env;
        this.ignore = data.ignore;
        this.observations = data.observations;
        this.status = data.status;
    }
}