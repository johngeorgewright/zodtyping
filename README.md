# zodtyping

Generate [zod](https://github.com/colinhacks/zod) from static types & JSON schema.

## Instructions

### Install

```
npm install zod
npm install -D zodtyping
```

### Use from the command line

1. Create a file, in the root of your project, called "zodtyping.yml".

   ```yaml
   # zodtyping.yml

   targetFile: src/other-zod.ts # The file to create
   zodtypeFormat: {type}Zt # Optional: use a custom name format for the created zod type
   typeFormat: {type}Type  # Optional: use a custom name format for the created type
   sourceTypes:
     exportStaticType: true # Optional: export static types as well (true by default)
     file: src/types.ts # The file where your type lives
     type: Foo # The type you want to convert to a zod type
   ```

   You can also specify a list of target files, if you want to create more than one:

   ```yaml
   # zodtyping.yml

   - targetFile: src/other-zod.ts
     sourceTypes:
       file: src/types.ts
       type: Foo

   - targetFile: src/zod.ts
     sourceTypes:
       # Source types can also be a list
       - file: src/types.ts
         type: Foo

       - file: json/my-json-schema.json # You can even use JSON schema files!!
         type: [ExampleType, AnotherExampleType] # You may use an array of types
   ```

1. Then run: `npx zodtyping`

### Use from a script

Basic example:

```ts
import { Generator } from 'zodtyping'

const generator = new Generator({
  targetFile: 'src/zod.ts',
  // optional: runtypeFormat / typeFormat (see above)
})

generator
  .generate([
    { file: 'src/types.ts', type: 'Foo' },
    { file: 'json/my-json-schema.json', type: 'ExampleType' },
  ])
  .then((file) => file.save())
```

#### Passing a custom tsconfig file

```ts
const generator = new Generator({
  targetFile: 'src/zod.ts',
  tsConfigFile: '/path/to/tsconfig.json',
})
```

#### Passing a custom ts-morph project (for the internal compiler)

(see [generate.ts](src/generate.ts) for the defaults)

```ts
import { Project } from 'ts-morph'

const generator = new Generator({
  targetFile: 'src/zod.ts',
  project: new Project({
    // ...
  }),
})
```

## Contributing

1. Install [Yarn](https://yarnpkg.com/)
1. Link your workspace `yarn`
1. If using VSCode, be sure to accept the workspace TypeScript version
1. If using another editor, install the [Yarn SDK](https://yarnpkg.com/getting-started/editor-sdks) for it (and commit with your PR)

## Thanks

Inspired by a [gist](https://gist.github.com/skurfuerst/a07ab23c3e40a45f2268f7700ceeceaf) by [skurfuerst](https://gist.github.com/skurfuerst).
