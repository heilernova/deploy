export const DB_STRUCTURE_BASE = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users
(
    id TEXT,
    created_at TEXT,
    update_at TEXT,
    role TEXT,
    name TEXT,
    email TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS users_tokens
(
    id TEXT,
    created_at TEXT,
    user_id TEXT,
    type TEXT,
    hostname TEXT,
    ip TEXT,
    device TEXT,
    platform TEXT,
    exp TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects
(
    id TEXT,
    created_at TEXT,
    update_at TEXT,
    deploy_at TEXT,
    domain TEXT,
    name TEXT,
    process_name TEXT UNIQUE,
    version TEXT,
    location TEXT,
    startup_file TEXT,
    framework TEXT,
    running_on TEXT,
    runtime_environment TEXT,
    url TEXT,
    repository TEXT,
    env TEXT,
    ignore TEXT,
    observation TEXT,
    UNIQUE(domain, name, version)
);

CREATE TABLE IF NOT EXISTS projects_log
(
    id TEXT,
    created_at TEXT,
    project_id TEXT,
    user_id TEXT, type TEXT,
    detail TEXT,
    data TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects_users
(
    project_id TEXT,
    user_id TEXT,
    permissions TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);
`;