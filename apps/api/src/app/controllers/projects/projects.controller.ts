import { AuthGuard } from '@deploy/api/auth';
import { ProjectPipe, ProjectsService } from '@deploy/api/models/projects';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectCreateDto, ProjectUpdateDto } from './dto';
import { IProject } from '@deploy/schemas/projects';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly _projects: ProjectsService){}

    @Get()
    async getAll(){
        return {
            data: await this._projects.getAll()
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
}
