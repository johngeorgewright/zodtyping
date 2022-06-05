import generateFixture from './generateFixture'

test('literal', async () => {
  expect((await generateFixture('literal', ['A', 'B', 'C'])).getText())
    .toMatchInlineSnapshot(`
    "import { literal, infer as Infer } from 'zod';

    export const A = literal(\\"foo\\");

    export type A = Infer<typeof A>;

    export const B = literal(2);

    export type B = Infer<typeof B>;

    export const C = literal(true);

    export type C = Infer<typeof C>;
    "
  `)
})
