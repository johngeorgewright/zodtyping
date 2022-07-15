import generateFixture from './generateFixture'

let warn: jest.Mock<void>
let consoleWarn = console.warn

beforeEach(() => {
  warn = jest.fn()
  console.warn = warn
})

afterEach(() => {
  console.warn = consoleWarn
})

test('circular references', async () => {
  expect((await generateFixture('circular-references', ['User'])).getText())
    .toMatchInlineSnapshot(`
    "import { Student as _Student, Teacher as _Teacher } from './circular-references';
    import { lazy, ZodType, object, literal, array, infer as Infer } from 'zod';

    export const Teacher: ZodType<_Teacher> = lazy(() => object({ type: literal(\\"teacher\\"), students: array(Student), reportsTo: Teacher, }));

    export type Teacher = Infer<typeof Teacher>;

    export const Student: ZodType<_Student> = lazy(() => object({ type: literal(\\"student\\"), teacher: Teacher, }));

    export type Student = Infer<typeof Student>;

    export const User = Student.or(Teacher);

    export type User = Infer<typeof User>;
    "
  `)

  expect(warn.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        "Spotted a circular reference between \`Teacher\` and \`Student\`. This may cause infinite loops at runtime.",
      ],
      Array [
        "Spotted a circular reference between \`Student\` and \`Teacher\`. This may cause infinite loops at runtime.",
      ],
    ]
  `)
})
