import generateFixture from './generateFixture'

test('tuple', async () => {
  expect((await generateFixture('tuple', ['A', 'B'])).getText())
    .toMatchInlineSnapshot(`
    "import { tuple, number, string, infer as Infer } from 'zod';

    export const A = tuple(number(), string(), number(),);

    export type A = Infer<typeof A>;

    export const B = tuple(A, A,);

    export type B = Infer<typeof B>;
    "
  `)
})
