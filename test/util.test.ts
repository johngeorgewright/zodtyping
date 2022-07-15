import { find, getRelativeImportPath, last, setHas } from '../src/util'
import * as path from 'path'

test('last', () => {
  expect(last([1, 2, 3, 4])).toBe(4)
})

test('find', () => {
  expect(find([1, 2, 3, 4, 5], (x) => (x === 4 ? x * 2 : false))).toBe(8)
})

test('setHas', () => {
  const set = new Set([{ mung: 'face' }])
  expect(setHas(set, ({ mung }) => mung === 'face')).toBe(true)
  expect(setHas(set, ({ mung }) => mung === 'mung')).toBe(false)
})

test('getRelativeImportPath', () => {
  expect(
    getRelativeImportPath(__dirname, path.resolve('../src/zod.types.ts'))
  ).toBe('../src/zod.types')
  expect(getRelativeImportPath(__dirname, path.resolve('../src/zod.mts'))).toBe(
    '../src/zod.mts'
  )
  expect(getRelativeImportPath(__dirname, 'zod')).toBe('zod')
  expect(getRelativeImportPath('./test.ts', './test/recursive.ts')).toBe(
    './test/recursive.ts'
  )
})
