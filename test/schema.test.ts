import * as pathHelper from 'path'
import Generator from '../src/Generator'

test('json schema', async () => {
  const generator = new Generator({
    targetFile: pathHelper.join(__dirname, `schema.zod.ts`),
  })

  const file = await generator.generate({
    file: pathHelper.join(__dirname, 'schema.json'),
    type: 'ExampleSchema',
  })

  expect(file!.getText()).toMatchInlineSnapshot(`
    "import { object, string, number, undefined as Undefined, literal, infer as Infer } from 'zod';

    export const ExampleSchema = object({ firstName: string(), lastName: string(), age: number().or(Undefined()).optional(), hairColor: literal(\\"black\\").or(literal(\\"brown\\")).or(literal(\\"blue\\")).or(Undefined()).optional(), });

    export type ExampleSchema = Infer<typeof ExampleSchema>;
    "
  `)
})
