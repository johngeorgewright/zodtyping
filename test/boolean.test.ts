import generateFixture from './generateFixture'

test('boolean', async () => {
  expect((await generateFixture('boolean', ['A'])).getText())
    .toMatchInlineSnapshot(`
    "import { boolean, infer as Infer } from 'zod';

    export const A = boolean();

    export type A = Infer<typeof A>;
    "
  `)
})
