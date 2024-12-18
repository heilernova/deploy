import { Framework, RunningOn, RuntimeEnvironment } from '@deploy/schemas/projects';
import { OmitBy } from '@deploy/core';

export interface DbProjectInterface {
    id: string;
    createdAt: string;
    updatedAt: string;
    deployAt: string | null;
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
    repository: string | null;
    env:  string;
    ignore: string;
    observation: string | null
}

export type DbProjectUpdateValues = Partial<OmitBy<DbProjectInterface, "id" | "createdAt">>;