import generateFixture from './generateFixture'

test('optional property', async () => {
  expect((await generateFixture('optional', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { object, string, undefined as Undefined, infer as Infer } from 'zod';

    export const A = object({ foo: string().or(Undefined()).optional(), });

    export type A = Infer<typeof A>;
    "
  `)
})
