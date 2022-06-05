import generateFixture from './generateFixture'

test('unknown', async () => {
  expect((await generateFixture('unknown', ['A', 'B'])).getText())
    .toMatchInlineSnapshot(`
    "import { unknown as Unknown, infer as Infer } from 'zod';

    export const A = Unknown();

    export type A = Infer<typeof A>;

    export const B = Unknown();

    export type B = Infer<typeof B>;
    "
  `)
})
