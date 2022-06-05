import generateFixture from './generateFixture'

test('strings', async () => {
  expect((await generateFixture('string', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { string, infer as Infer } from 'zod';

    export const A = string();

    export type A = Infer<typeof A>;
    "
  `)
})
