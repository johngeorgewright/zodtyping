import generateFixture from './generateFixture'

test('record', async () => {
  expect((await generateFixture('record', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { record, string, infer as Infer } from 'zod';

    export const A = record(string(), string());

    export type A = Infer<typeof A>;
    "
  `)
})
