import generateFixture from './generateFixture'

test('import', async () => {
  expect((await generateFixture('import.a', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { object, string, infer as Infer } from 'zod';

    export const A = object({ foo: string(), });

    export type A = Infer<typeof A>;
    "
  `)
})
