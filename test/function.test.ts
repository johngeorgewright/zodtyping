import { Project, QuoteKind } from 'ts-morph'
import generateFixture from './generateFixture'

test('function', async () => {
  expect(
    (
      await generateFixture('function', ['A', 'B', 'C', 'D', 'E', 'F'])
    ).getText()
  ).toMatchInlineSnapshot(`
    "import { A as _A, B as _B, C as _C, D as _D, E as _E, F as _F } from './function';
    import { function as Function, string, number, void as Void, undefined as Undefined, unknown as Unknown } from 'zod';

    export const A = Function().args(string(), number(),).returns(Void());

    export type A = _A;

    export const B = Function().args(number(),).returns(Void());

    export type B = _B;

    export const C = Function().args(string(), number().or(Undefined()),).returns(Unknown());

    export type C = _C;

    export const D = Function().args(number(),).returns(string()).implement(_D);

    export type D = typeof D;

    export const E = Function().args(number(),).returns(string()).implement(_E);

    export type E = typeof E;

    export const F = Function().args(number(),).returns(string());

    export type F = _F;
    "
  `)
})

test('function with non-strict nulls', async () => {
  expect(
    (
      await generateFixture('function', ['C'], {
        project: new Project({
          manipulationSettings: {
            quoteKind: QuoteKind.Single,
            usePrefixAndSuffixTextForRename: false,
            useTrailingCommas: true,
          },

          skipAddingFilesFromTsConfig: true,
        }),
      })
    ).getText()
  ).toMatchInlineSnapshot(`
    "import { C as _C } from './function';
    import { function as Function, string, number, unknown as Unknown } from 'zod';

    export const C = Function().args(string(), number().optional(),).returns(Unknown());

    export type C = _C;
    "
  `)
})
