# osint.ts
typescript library for creating OSINT modules

# Development

## ModuleCategory Enum

found in `lib/sdk/enum/eModuleCategory.ts` aliased as `@enum/eModuleCategory`

```typescript
export enum ModuleCategory {
    Username = 'username',
    Phone    = 'phone',
    Email    = 'email',
    IP       = 'ip',
    Domain   = 'domain',
}
```

Each module must be assigned a category, which describes its required input.

## ModuleType Enum

found in `lib/sdk/enum/eModuleType.ts` aliased as `@enum/eModuleType`

```typescript
export enum ModuleType {
    Enrichment = 'enrichment',
    Existence  = 'existence',
}
```

Each module must be assigned a type, which is used to describe the date returned.

## ModuleMeta Interface

found in `lib/sdk/interface/iModuleMeta.ts` aliased as `@interface/iModuleMeta`

```typescript
export interface ModuleMeta {
    name        : string;
    description : string;

    category    : ModuleCategory;
    type        : ModuleType;
}
```

Each module must be assigned metadata, which is used for indexing.

## Module Superclass

found in `lib/index.ts`

```typescript
export class Module {

    public meta: ModuleMeta;

    constructor(meta: ModuleMeta) { this.meta = meta; }

    public async query(query: string): Promise<any> { throw new Error("Method not implemented."); }
}
```

Every module has a set metadata, and must implement the `query` method, which returns a promise of the module's result.

## In Practice

```typescript
// define our module's metadata
const META: ModuleMeta = {
    name        : "cashapp",
    description : "Searches for CashApp profile info based on a given username.",

    category    : ModuleCategory.Username,
    type        : ModuleType.Enrichment,
}

// create a new class extending our Module superclass
export class CashApp extends Module {

    // construct our class using our metadata
    constructor() { super(META); }

    public async query(query: string): Promise<any> {

        const response = await axios.get(`https://cash.app/$${query}`);

        // determine if the query has returned a valid response
        const exists = response.data.includes('var profile =');

        // parse the response, and return data which is then sent to the client
        return {
            status : exists ? 200                                                                : 404,
            data   : exists ? JSON.parse(response.data.split('var profile = ')[1].split(';')[0]) : null,
        }
    }
}

// export a new instance of our module's class
module.exports = new CashApp;
```

## QueryStandardization Interface

found in `lib/sdk/interface/iQueryStandardization.ts` aliased as `@interface/iQueryStandardization`

```typescript
export default interface IQueryStandardization {

    readonly category    : ModuleCategory;

    readonly minLength   : number;
    readonly maxLength   : number;

    readonly regex     ? : RegExp;
}
```

Provides category-specific query standardization to catch some common mistakes.

### Example

```typescript
// create a new class implementing our interface
export default class QDomain implements IQueryStandardization {

    // define our category
    readonly category    : ModuleCategory = ModuleCategory.Domain;

    // define our query standardization
    readonly minLength   : number = 3;
    readonly maxLength   : number = 255;

    // optionally define a regex to match against
    readonly regex     ? : RegExp = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
}

// export a new instance of our class
module.exports = new QDomain;
```