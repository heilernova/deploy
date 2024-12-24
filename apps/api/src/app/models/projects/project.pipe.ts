import { HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { getService } from '@deploy/api/utils/get-service';
import { isUUID } from 'class-validator';
import { ProjectsService } from './projects.service';

@Injectable()
export class ProjectPipe implements PipeTransform {
  async transform(value: string) {
    if (!isUUID(value)){
      throw new HttpException("Formato de parámetro incorrecto", 404);
    }
    
    const projectsService = await getService(ProjectsService);
    const result = await projectsService.get(value);
    if (!result){
      throw new HttpException(`No existe el proyecto con el id ${value}`, 404);
    }
    return result;
  }
}
