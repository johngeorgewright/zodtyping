import generateFixture from './generateFixture'

test('dont generate static types', async () => {
  expect(
    (
      await generateFixture('without-static-types', ['Three'], {
        exportStaticType: false,
      })
    ).getText()
  ).toMatchInlineSnapshot(`
    "import { object, literal, string, number } from 'zod';

    export const One = object({ type: literal(\\"one\\"), value: string(), });
    export const Two = object({ type: literal(\\"two\\"), value: number(), });
    export const Three = One.or(Two);
    "
  `)
})
