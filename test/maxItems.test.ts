import * as pathHelper from 'path'
import Generator from '../src/Generator'

test('json schema', async () => {
  const generator = new Generator({
    targetFile: pathHelper.join(__dirname, `maxItems.schema.zod.ts`),
  })

  const file = await generator.generate({
    file: pathHelper.join(__dirname, 'maxItems.schema.json'),
    type: 'ExampleSchema',
  })

  expect(file!.getText()).toMatchInlineSnapshot(`
    "import { object, tuple, record, string, unknown as Unknown, undefined as Undefined, infer as Infer } from 'zod';

    export const ExampleSchema = object({ testArray: tuple().or(tuple(record(string(), Unknown()),)).or(tuple(record(string(), Unknown()), record(string(), Unknown()),)).or(Undefined()).optional(), });

    export type ExampleSchema = Infer<typeof ExampleSchema>;
    "
  `)
})
