import { APIEnvironment }    from "@enum/eAPIEnvironment";
import { ModuleCategory }    from "@enum/eModuleCategory";
import { ModuleType }        from "@enum/eModuleType";

import { IModuleMeta }       from "@interface/iModuleMeta";
import IQueryStandardization from "@interface/iQueryStandardization";

import RequireAll            from "require-all";
import path                  from "path";

/*
    * @return { Module }
    * @description Module superclass.
*/
export class Module {

    public meta: IModuleMeta;

    constructor(meta: IModuleMeta) { this.meta = meta; }

    public async query(query: string): Promise<any> { throw new Error("Method not implemented."); }
}

/*
    * @return { Module[] }
    * @description Returns an array of all modules.
*/
export function getModules(implDir: string) : Module[] {

    let indexed : Module[] = [];

    for (const cat in ModuleCategory) {

        const modules = Object.entries(
            RequireAll({
                dirname: implDir,
                filter: /^(?!-)(.+)\.js$/,
            })
        );

        modules.forEach(m => { indexed.push(m[1]) });
    }

    return indexed;
}

export {
    APIEnvironment,
    ModuleCategory,
    ModuleType,
    IModuleMeta,
    IQueryStandardization
}