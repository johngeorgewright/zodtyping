import generateFixture from './generateFixture'

test('mapRuntypeName', async () => {
  const actual = (
    await generateFixture('typeNameFormat', ['B'], {
      generatorOpts: {
        runtypeFormat: `Mapped{type}Foo`,
        typeFormat: `Mapped{type}Bar`,
      },
    })
  ).getText()

  expect(actual).toMatchInlineSnapshot(`
    "import { object, string, infer as Infer, array } from 'zod';

    export const MappedAFoo = object({ foo: string(), });

    export type MappedABar = Infer<typeof MappedAFoo>;

    export const MappedBFoo = object({ bar: MappedAFoo, baz: MappedAFoo, nest: object({ baz2: array(MappedAFoo), }), });

    export type MappedBBar = Infer<typeof MappedBFoo>;
    "
  `)
})

test('incorrect formatting', async () => {
  await expect(() =>
    generateFixture('typeNameFormat', ['B'], {
      generatorOpts: {
        runtypeFormat: 'notypeparam',
      },
    })
  ).rejects.toThrow(
    `Type format must contain placeholder '{type}'. Got: "notypeparam".`
  )
})
