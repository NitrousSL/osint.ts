import { ModuleCategory } from "@enum/eModuleCategory";
import { ModuleType }     from "@enum/eModuleType";

/*
    * @return { IModuleMeta }
    * @description Interface for module metadata.
*/
export interface IModuleMeta {
    name        : string;
    description : string;

    category    : ModuleCategory;
    type        : ModuleType;
}

// Path: lib/sdk/interface/iModuleMeta.ts
