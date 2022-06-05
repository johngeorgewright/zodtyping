import generateFixture from './generateFixture'

test('interface', async () => {
  expect((await generateFixture('interface', ['B', 'C'])).getText())
    .toMatchInlineSnapshot(`
    "import { foo as _foo, boo as _boo } from './interface';
    import { object, string, number, boolean, infer as Infer, literal, function as Function, void as Void } from 'zod';

    export const A = object({ foo: string(), bar: number(), [\`has spaces\`]: boolean(), [\`+1\`]: boolean(), [\`-1\`]: boolean(), __underscores__: boolean(), $dollar: boolean(), [\`\\\\\${escaped template vars}\`]: boolean(), });

    export type A = Infer<typeof A>;

    export const B = object({ a: A, b: literal(\\"B\\"), });

    export type B = Infer<typeof B>;

    export const C = object({ foo: Function().args().returns(string()), bar: number(), boo: Function().args(string(),).returns(Void()), });

    export type C = _boo;
    "
  `)
})
