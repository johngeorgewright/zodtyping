import generateFixture from './generateFixture'

test('builtin', async () => {
  expect((await generateFixture('builtin', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { object, instanceof as InstanceOf, infer as Infer } from 'zod';

    export const A = object({ a: InstanceOf(Uint8Array), });

    export type A = Infer<typeof A>;
    "
  `)
})
