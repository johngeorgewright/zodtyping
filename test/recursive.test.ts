import generateFixture from './generateFixture'

test('recursive', async () => {
  expect((await generateFixture('recursive', ['A', 'B'])).getText())
    .toMatchInlineSnapshot(`
    "import { lazy, object, string, infer as Infer, array } from 'zod';

    export const A = lazy(() => object({ recurse: string().or(A), }));

    export type A = Infer<typeof A>;

    export const B = lazy(() => object({ recurse: array(B), }));

    export type B = Infer<typeof B>;
    "
  `)
})
