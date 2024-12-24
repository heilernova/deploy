import { HttpException, Injectable } from '@nestjs/common';
import { execSync } from 'child_process';

export interface Pm2Process {
    pm_id: number,
    pid: number,
    name: string,
    pm2_env: { [key: string]: string | number }&{
        exit_code: number,
        node_version: string,
        version: string;
        PORT: string;
        status: "online" | "stopping" | "stopped" | "launching" | "errored" | "one-launch-status";
        pm_err_log_path: string;
        pm_out_log_path: string;
        pm_cwd: string;
        pm_exec_path: string;
        unstable_restarts: number;
        restart_time: number;
        pm_uptime: number;

    },
    monit: {
        cpu: number,
        memory: number
    }
}

@Injectable()
export class Pm2Service {

    version(): string {    
        try {
            return execSync("pm2 --version").toString("utf8");
        } catch {
            throw new HttpException('"pm2" no se reconoce como un comando interno o externo en el servidor.', 500)
        }
    }

    getAll(): Pm2Process[] {
        const result = execSync('pm2 jlist');
        return JSON.parse(result.toString());
    }
    
    get(value: number | string): Pm2Process | undefined {
        const result = execSync('pm2 jlist');
        const list: Pm2Process[] =  JSON.parse(result.toString());

        return list.find(x => typeof value === "string" ? x.name == value : x.pm_id == value);

    }

    start(path: string, script: string, name: string, env: { [key: string]: string }): void {
        execSync(`pm2 start ${script} --name=${name}`, { cwd: path, env: { ...process.env, ...env } });
    }

    stop(value: string | number): void {
        execSync(`pm2 stop ${value}`);
    }

    reload(value: string | number, path: string, env?: { [key: string]: string }): void {
        if (env){
            execSync(`pm2 reload ${value} --update-env`, { cwd: path, env: { ...process.env, ...env } });
        } else {
            execSync(`pm2 reload ${value}`);
        }
    }

    delete(value: string | number): void {
        execSync(`pm2 delete ${value}`);
    }
}