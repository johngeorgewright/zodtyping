import generateFixture from './generateFixture'

test('numbers', async () => {
  expect((await generateFixture('number', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { number, infer as Infer } from 'zod';

    export const A = number();

    export type A = Infer<typeof A>;
    "
  `)
})
