import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

export const clearDir = (location: string, ignore: string[]):  Promise<string[]> => {
    const list: string[] = readdirSync(`${location}`);
    const fileToDelete: string[]  = list.filter(x => !ignore.some(y => y == x));

    return Promise.all(fileToDelete.map(async item => {
        rmSync(join(location, item), { force: true, recursive: true })
        return item;
    }))
}
