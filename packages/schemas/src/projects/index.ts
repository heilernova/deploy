import { ConvertDateToString, OmitBy, PartialWithout } from "@deploy/core";

export const FRAMEWORK_LIST = ["NestJS", "Angular", "FastAPI"] as const;
export const RUNTIME_ENVIRONMENT_LIST = ["Node.js", "Python", "PHP"] as const;
export const RUNNING_ON_LIST = ["PM2", "Docker", "LiteSpeed", "Apache"] as const;

export type Framework = typeof FRAMEWORK_LIST[number];
export type RunningOn = typeof RUNNING_ON_LIST[number];
export type RuntimeEnvironment = typeof RUNTIME_ENVIRONMENT_LIST[number];

export interface IProject {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deployAt: Date | null;
    domain: string;
    name: string;
    processName: string;
    version: string | null; 
    location: string;
    startupFile: string;
    framework: Framework | null;
    runningOn: RunningOn | null;
    runtimeEnvironment: RuntimeEnvironment | null;
    url: string | null;
    repository: { 
        type: "git",
        url: string
    } | null;
    env: { [key: string]: string }
    ignore: string[];
    observations: string | null;
}

export type ProjectCreateValues = PartialWithout<OmitBy<IProject, "id" | "createdAt" | "updatedAt" | "deployAt">, "domain" | "name" | "processName" | "location" | "startupFile">
export type ProjectUpdateValues = Partial<OmitBy<IProject, "id" | "createdAt" | "updatedAt" | "deployAt">>

export type ApiProject = ConvertDateToString<IProject>;
