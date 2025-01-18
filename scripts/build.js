const archiver = require("archiver");
const { existsSync, readFileSync, createWriteStream, writeFileSync } = require("node:fs");
const { join } = require("node:path")

const pathAPI = join(__dirname, "../dist/apps/api");
const pathPanel = join(__dirname, "../dist/apps/panel");

if (!existsSync(pathAPI) || !existsSync(pathPanel)) {
    console.log("Error: No se encontraron los archivos de la api o panel");
}
const version = JSON.parse(readFileSync(join(__dirname, "../package.json")).toString()).version;
const zipName = `v${version}.zip`
const ouPut = createWriteStream(zipName);

const panelIndexHTMLContent = readFileSync(join(pathPanel, "browser", "index.html")).toString();
const newPanelIndexHTMLContent = panelIndexHTMLContent.replace(/<meta name="version" content="developer">/, `<meta name="version" content="${version}">`);
writeFileSync(join(pathPanel, "browser", "index.html"), newPanelIndexHTMLContent);

const archive = archiver("zip");
archive.pipe(ouPut);

archive.directory(pathAPI, "api");
archive.directory(pathPanel, "api/public");

archive.on("error", ()   => {
    console.log("No se pudo comprimir los archivos.")
});
archive.finalize().then(() => {
    console.log("✔", "Archivo comprimidos");
})