import { Project, QuoteKind } from 'ts-morph'
import generateFixture from './generateFixture'

test('strict nulls', async () => {
  expect((await generateFixture('null', ['A', 'B', 'C'])).getText())
    .toMatchInlineSnapshot(`
    "import { null as Null, infer as Infer, string, object, undefined as Undefined } from 'zod';

    export const A = Null();

    export type A = Infer<typeof A>;

    export const B = Null().or(string());

    export type B = Infer<typeof B>;

    export const C = object({ a: Null(), b: Null().or(string()), c: Null().or(string()).or(Undefined()).optional(), });

    export type C = Infer<typeof C>;
    "
  `)
})

test('non-strict nulls', async () => {
  expect(
    (
      await generateFixture('null', ['A', 'B', 'C'], {
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
    "import { null as Null, infer as Infer, string, object } from 'zod';

    export const A = Null();

    export type A = Infer<typeof A>;

    export const B = string();

    export type B = Infer<typeof B>;

    export const C = object({ a: Null(), b: string(), c: string().optional(), });

    export type C = Infer<typeof C>;
    "
  `)
})
