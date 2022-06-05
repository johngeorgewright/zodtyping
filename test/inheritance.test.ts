import generateFixture from './generateFixture'

test('inheritance', async () => {
  expect((await generateFixture('inheritance', ['C', 'D', 'E'])).getText())
    .toMatchInlineSnapshot(`
    "import { object, string, infer as Infer, number, literal } from 'zod';

    export const C = object({ bar: string(), foo: string(), });

    export type C = Infer<typeof C>;

    export const D = object({ bar: number(), moo: string(), foo: number(), car: string(), });

    export type D = Infer<typeof D>;

    export const E = object({ imported: literal(true), });

    export type E = Infer<typeof E>;
    "
  `)
})
