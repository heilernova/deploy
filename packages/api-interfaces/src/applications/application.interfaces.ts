export interface ApplicationCreateBody {
    domain: string;
    name: string;
    process_name: string;
    version?: string;
    location: string;
    startup_file?: string | null;
    framework?: "NestJS" | "Angular" | "FastAPI" | null;
    running_on?: "PM2" | "Docker" | "LiteSpeed" | "Apache" | null;
    runtime_environment?: "Node.js" | "Python" | "PHP" | null;
    url?: string | null;
    repository?: { 
        type: "git",
        url: string,
        directory?: string
    } | null;
    env?: { [key: string]: string };
    ignore?: string[];
}

export interface ApplicationUpdateBody {
    domain?: string;
    name?: string;
    process_name?: string;
    version?: string;
    location?: string;
    startup_file?: string | null;
    framework?: "NestJS" | "Angular" | "FastAPI" | null;
    running_on?: "PM2" | "Docker" | "LiteSpeed" | "Apache" | null;
    runtime_environment?: "Node.js" | "Python" | "PHP" | null;
    url?: string | null;
    repository?: { 
        type: "git",
        url: string,
        directory?: string
    } | null;
    env?: { [key: string]: string };
    ignore?: string[];
}

export interface ApplicationInfo {
    id: string;
    created_at: string;
    updated_at: string;
    deploy_at: string | null;
    domain: string;
    name: string;
    process_name: string;
    version: string | null;
    location: string;
    startup_file: string | null;
    framework: "NestJS" | "Angular" | "FastAPI" | null;
    running_on: "PM2" | "Docker" | "LiteSpeed" | "Apache" | null;
    runtime_environment?: "Node.js" | "Python" | "PHP" | null;
    url: string | null;
    repository: { 
        type: "git",
        url: string,
        directory?: string
    } | null;
    env: { [key: string]: string };
    ignore: string[];
}