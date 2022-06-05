import generateFixture from './generateFixture'

test('enum', async () => {
  expect((await generateFixture('enum', ['A', 'B', 'D'])).getText())
    .toMatchInlineSnapshot(`
    "import { A as _A, B as _B, C as _C } from './enum';
    import { nativeEnum, infer as Infer, literal } from 'zod';

    export const A = nativeEnum(_A);

    export type A = Infer<typeof A>;

    export const B = nativeEnum(_B);

    export type B = Infer<typeof B>;

    export const D = literal(_C.A).or(literal(_C.B));

    export type D = Infer<typeof D>;
    "
  `)
})
