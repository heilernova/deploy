import { AuthGuard } from '@deploy/api/auth';
import { ProjectPipe, ProjectsService } from '@deploy/api/models/projects';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectCreateDto, ProjectUpdateDto } from './dto';
import { ApiProject, IProject, ProjectStatus } from '@deploy/schemas/projects';
import { Pm2Service } from '@deploy/api/common/pm2/pm2.service';
import { ApiResponseWithData } from '@deploy/schemas/api';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly _projects: ProjectsService, private readonly _pm2: Pm2Service){}

    @Get()
    async getAll(): Promise<ApiResponseWithData<ApiProject[]>>{
        const processes = this._pm2.getAll();
        const projects = await this._projects.getAll();
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
            body.name ? this._projects.isAvailableName(body.name, project.domain) : true,
            body.processName ? this._projects.isAvailableProcessName(body.processName) : true
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
        if (project.runningOn == "PM2"){
            this._pm2.version();
            let process = this._pm2.getAll().find(x => x.name == project.processName);
            if (process){
                this._pm2.reload(process.name, project.startupFile, project.env);
            } else {
                this._pm2.start(project.location, project.startupFile, project.processName, project.env);
            }
            process = this._pm2.get(project.processName);
            return {
                data: process?.pm2_env.status ?? null
            }
        } if (project.runningOn === null){
            return;
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
        } if (project.runningOn === null){
            return;
        }
        throw new HttpException(`No hay soporte para aplicaciones ejecutadas en ${project.runningOn}.`, 500);
    }
}
