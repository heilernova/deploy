import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { ProjectPipe, ProjectsService } from '@deploy/api/models/projects';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectCreateDto, ProjectUpdateDto } from './dto';
import { ApiProject, Framework, IProject, ProjectStatus } from '@deploy/schemas/projects';
import { Pm2Service } from '@deploy/api/common/pm2/pm2.service';
import { ApiResponseWithData } from '@deploy/schemas/api';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly _projects: ProjectsService, private readonly _pm2: Pm2Service){}

    @Get()
    async getAll(@Authenticated() session: AppSession): Promise<ApiResponseWithData<ApiProject | { id: string, domain: string, name: string, framework: Framework | null }[]>>{
        const projects = await this._projects.getAll();
        
        if (session.type == "cli"){
            return {
                data: projects.map(x => {
                    return {
                        id: x.id,
                        domain: x.domain,
                        name: x.name,
                        framework: x.framework,
                    }
                })
            }
        }
        
        const processes = this._pm2.getAll();

        return {
            data: projects.map(project => {
                let status: ProjectStatus = "online";
                if (project.runningOn == "PM2"){
                    status = processes.find(x => x.name == project.processName)?.pm2_env.status ?? "stopped";
                }
                return {
                    id: project.id,
                    createdAt: project.createdAt.toISOString(),
                    updatedAt: project.updatedAt.toISOString(),
                    deployAt: project.deployAt ? project.deployAt.toISOString() : null, 
                    domain: project.domain,
                    name: project.name,
                    processName: project.processName,
                    version: project.version,
                    startupFile: project.startupFile,
                    url: project.url,
                    location: project.location,
                    framework: project.framework,
                    runningOn: project.runningOn,
                    runtimeEnvironment: project.runtimeEnvironment,
                    env: project.env,
                    ignore: project.ignore,
                    repository: project.repository,
                    observations: project.observations,
                    status,
                }
            })
        }
    }

    @Post()
    async create(@Body() body: ProjectCreateDto){
        const [name, processName] = await  Promise.all([
            this._projects.isAvailableName(body.name, body.domain),
            this._projects.isAvailableProcessName(body.processName)

        ]);

        if (!name || !processName){
            const message: string[] = [];
            if (!name) message.push("El nombre ya esta en uso para el dominio.");
            if (!processName) message.push("El nombre del proceso ya esta en uso.")
            throw new HttpException({ message } , 400);
        }

        const project = await this._projects.create(body);
        return {
            data: project
        }
    }

    @Put(":id")
    async update(@Param("id", ProjectPipe) project: IProject, @Body() body: ProjectUpdateDto){

        const [name, processName] = await  Promise.all([
            body.name ? this._projects.isAvailableName(body.name, project.domain, project.id) : true,
            body.processName ? this._projects.isAvailableProcessName(body.processName, project.id) : true
        ]);

        if (!name || !processName){
            const message: string[] = [];
            if (!name) message.push("El nombre ya esta en uso para el dominio.");
            if (!processName) message.push("El nombre del proceso ya esta en uso.")
            throw new HttpException({ message } , 400);
        }

        await this._projects.update(project.id, body);
    }

    @Delete(":id")
    async delete(@Param("id", ProjectPipe) project: IProject){
        this._projects.delete(project.id);
    }

    @Post(":id/launch")
    async launch(@Param("id", ProjectPipe) project: IProject){
        let message: string | undefined = undefined;
        if (project.runningOn == "PM2"){
            if (!this._pm2.installed()){
                throw new HttpException("No se encuentra instalado PM2", 500);
            }

            if (!existsSync(join(project.location, project.startupFile))){
                throw new HttpException(`No se encontró el archivo de arranque el proyecto ${join(project.location, project.startupFile)}`, 500);
            }

            if (project.runtimeEnvironment == "Node.js" && !existsSync(join(project.location, "node_modules"))){
                message = execSync('npm i --omit=dev', { cwd:  project.location, stdio: "pipe" }).toString("utf8");
            }

            let process = this._pm2.getAll().find(x => x.name == project.processName);
            if (process){
                this._pm2.reload(process.name, project.location, project.env);
            } else {
                this._pm2.start(project.location, project.startupFile, project.processName, project.env);
            }
            process = this._pm2.get(project.processName);
            return {
                message: message,
                data: process?.pm2_env.status ?? null
            }
        } if (project.runningOn === null){
            return {
                data: "stop"
            }
        }
        throw new HttpException(`No hay soporte para aplicaciones ejecutadas en ${project.runningOn}.`, 500);
    }

    @Post(":id/stop")
    async stop(@Param("id", ProjectPipe) project: IProject){
        if (project.runningOn == "PM2"){
            this._pm2.version();
            const process = this._pm2.getAll().find(x => x.name == project.processName);
            if (!process){
                throw new HttpException("No se encontró el proceso del aplicación", 400);
            }
            this._pm2.stop(process.pm_id);
            return {
                data: "stopped"
            }
        } if (project.runningOn === null){
            return;
        }
        throw new HttpException(`No hay soporte para aplicaciones ejecutadas en ${project.runningOn}.`, 500);
    }
}
