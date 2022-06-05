import generateFixture from './generateFixture'

test('array', async () => {
  expect((await generateFixture('array', ['B'])).getText())
    .toMatchInlineSnapshot(`
    "import { array, string, number, object, infer as Infer } from 'zod';

    export const A = object({ foo: string(), });

    export type A = Infer<typeof A>;

    export const B = array(string().or(number()).or(A));

    export type B = Infer<typeof B>;
    "
  `)
})
