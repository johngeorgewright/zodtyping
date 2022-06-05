import generateFixture from './generateFixture'

test('namespace', async () => {
  expect(
    (
      await generateFixture('namespace', ['A.B', 'B.C.D', 'A.C', 'A.D'])
    ).getText()
  ).toMatchInlineSnapshot(`
    "import { object, string, infer as Infer, number, unknown as Unknown } from 'zod';

    export namespace A {
      export const B = object({ C: string(), });

      export type B = Infer<typeof B>;

      export const C = Unknown();

      export type C = Infer<typeof C>;

      export const D = object({ E: number(), });

      export type D = Infer<typeof D>;
    }

    export namespace B {
      export namespace C {
        export const D = number();

        export type D = Infer<typeof D>;
      }
    }
    "
  `)
})
