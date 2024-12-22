import { NestFactory } from "@nestjs/core";
import { Type } from "@nestjs/common";
import { AppModule } from "@deploy/api/app.module";

export const getService = async <T>(typeOrToken: Type<T> | string | symbol): Promise<T> => {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const service = appContext.get<T>(typeOrToken);
    return service;
};
