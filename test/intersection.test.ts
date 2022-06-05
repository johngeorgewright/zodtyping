import generateFixture from './generateFixture'

test('intersection', async () => {
  expect((await generateFixture('intersection', ['C'])).getText())
    .toMatchInlineSnapshot(`
    "import { object, string, infer as Infer } from 'zod';

    export const A = object({ foo: string(), });

    export type A = Infer<typeof A>;

    export const B = object({ bar: string(), });

    export type B = Infer<typeof B>;

    export const C = A.and(B);

    export type C = Infer<typeof C>;
    "
  `)
})
