import generateFixture from './generateFixture'

test('union', async () => {
  expect((await generateFixture('union', ['C'])).getText())
    .toMatchInlineSnapshot(`
    "import { string, number, infer as Infer } from 'zod';

    export const C = string().or(number());

    export type C = Infer<typeof C>;
    "
  `)
})
