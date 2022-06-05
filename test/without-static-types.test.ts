import generateFixture from './generateFixture'

test('dont generate static types', async () => {
  expect(
    (
      await generateFixture('string', ['A'], { exportStaticType: false })
    ).getText()
  ).toMatchInlineSnapshot(`
    "import { string } from 'zod';

    export const A = string();
    "
  `)
})
