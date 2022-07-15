import generateFixture from './generateFixture'

test('recursive', async () => {
  expect((await generateFixture('recursive', ['A', 'B'])).getText())
    .toMatchInlineSnapshot(`
    "import { A as _A, B as _B } from './recursive';
    import { lazy, ZodType, object, string, infer as Infer, array } from 'zod';

    export const A: ZodType<_A> = lazy(() => object({ recurse: string().or(A), }));

    export type A = Infer<typeof A>;

    export const B: ZodType<_B> = lazy(() => object({ recurse: array(B), }));

    export type B = Infer<typeof B>;
    "
  `)
})
