import generateFixture from './generateFixture'

test('duplicate references', async () => {
  expect(
    (
      await generateFixture('duplicate-references', ['HorseType', 'FooType'])
    ).getText()
  ).toMatchInlineSnapshot(`
    "import { object, null as Null, string, infer as Infer } from 'zod';

    export const FooType = Null().or(string());

    export type FooType = Infer<typeof FooType>;

    export const HorseType = object({ a: FooType, b: FooType, });

    export type HorseType = Infer<typeof HorseType>;
    "
  `)
})
