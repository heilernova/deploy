export const DB_STRUCTURE_BASE = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users
(
    id TEXT,
    createdAt TEXT,
    updateAt TEXT,
    role TEXT,
    name TEXT,
    email TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS users_tokens
(
    id TEXT,
    createdAt TEXT,
    userId TEXT,
    type TEXT,
    hostname TEXT,
    ip TEXT,
    device TEXT,
    platform TEXT,
    exp TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects
(
    id TEXT,
    createdAt TEXT,
    updatedAt TEXT,
    deployAt TEXT,
    domain TEXT,
    name TEXT,
    processName TEXT UNIQUE,
    version TEXT,
    location TEXT,
    startupFile TEXT,
    framework TEXT,
    runningOn TEXT,
    runtimeEnvironment TEXT,
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
    createdAt TEXT,
    projectId TEXT,
    userId TEXT, type TEXT,
    detail TEXT,
    data TEXT,
    FOREIGN KEY (projectId) REFERENCES projects(id),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects_users
(
    projectId TEXT,
    userId TEXT,
    permissions TEXT,
    FOREIGN KEY (projectId) REFERENCES projects(id),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(projectId, userId)
);
`;