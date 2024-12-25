import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Body, Controller, FileTypeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectPipe } from '@deploy/api/models/projects';
import { IProject } from '@deploy/schemas/projects';
import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { clearDir } from '@deploy/api/utils/clear-dir';
import extractZip from 'extract-zip';
import { execSync } from 'node:child_process';
import { Pm2Service } from '@deploy/api/common/pm2/pm2.service';

@UseGuards(AuthGuard)
@Controller('deploy')
export class DeployController {

    constructor(
        private readonly _pm2: Pm2Service
    ){}

    private async extractFiles(projectId: string, location: string, buffer: Buffer){
        const name = `zi-temp-${projectId}.zip`;
        writeFileSync(name, buffer);
        await extractZip(name, { dir: location });
        rmSync(name);
    }

    @Post()
    @UseInterceptors(FileInterceptor('zip'))
    async run(
        @Authenticated()
        session: AppSession,
        @Body("project", ProjectPipe)
        project: IProject,
        @UploadedFile(new ParseFilePipe({ validators: [  new FileTypeValidator({ fileType: 'zip' }) ]}))
        file: Express.Multer.File
    ){
        if (project.framework == "NestJS"){
            return this.nestJS(project, file.buffer);
        } else if (project.framework == "Angular"){
            return this.angular(project, file.buffer);
        }
    }

    async nestJS(project: IProject, buffer: Buffer){
        let currentPackage: { [p: string]: string } | undefined;
        let newPackage: { [p: string]: string } | undefined;
        let executeNPMInstall = false;

        if (existsSync(join(project.location, 'package.json'))){
            currentPackage = JSON.parse(readFileSync(join(project.location, 'package.json')).toString());
        }

        if (project.runningOn == "PM2"){
            project.ignore.push("node_modules");
            await clearDir(project.location, project.ignore);
            await this.extractFiles(project.id, project.location, buffer);
            if (existsSync(join(project.location, 'package.json'))){
                newPackage = JSON.parse(readFileSync(join(project.location, 'package.json')).toString());
            }
            if (!existsSync(join(project.location, 'node_modules'))) {
                executeNPMInstall = true;
            } else {
                const dependencies1 = currentPackage ? currentPackage['dependencies'] : {};
                const dependencies2 = newPackage ? newPackage['dependencies'] : {};
                if (Object.keys(dependencies1) != Object.keys(dependencies2)) {
                    executeNPMInstall = true;
                } else {
                    Object.entries(dependencies2).forEach(entry => {
                        if (entry[1] != dependencies1[entry[0]]){
                            executeNPMInstall = true;
                        }
                    })
                }

                if (executeNPMInstall){
                    execSync('npm i --omit=dev', { cwd:  project.location  });
                }
            }

            if (!execSync(join(project.location, project.startupFile))){
                throw new Error(`No se ha definido el archivo de arrange para el proyecto`);
            }

            const process = this._pm2.get(project.processName);
            if (process){
                this._pm2.reload(project.processName, project.location, project.env);
            } else {
                this._pm2.start(project.location, project.startupFile, project.processName, project.env);
            }
          
            return this._pm2.get(project.processName)?.pm2_env.status ?? "errored";
        }
    }

    async angular(project: IProject, buffer: Buffer){
        clearDir(project.location, project.ignore);
        await this.extractFiles(project.id, project.location, buffer);
        if (project.runningOn === "PM2"){
            const process = this._pm2.get(project.processName);
            if (process){
                this._pm2.reload(project.processName, project.location, project.env);
            } else {
                this._pm2.start(project.location, project.startupFile, project.processName, project.env);
            }
            return this._pm2.get(project.processName)?.pm2_env.status ?? "errored";
        } else {
            return "online";
        }
    }
}
