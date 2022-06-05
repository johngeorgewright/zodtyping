import { Type } from 'ts-morph'
import generateOrReuseType from './generateOrReuseType'
import TypeWriter from './TypeWriter'
import simpleTypeWriter from './simple'
import sortUndefinedFirst from '../sortUndefinedFirst'
import { Write } from './symbols'

export default function* intersecionTypeWriter(type: Type): TypeWriter {
  const [first, ...rest] = type.getIntersectionTypes().sort(sortUndefinedFirst)

  if (!first) return yield* simpleTypeWriter('undefined')

  yield* generateOrReuseType(first)
  for (const item of rest) {
    yield [Write, '.and(']
    yield* generateOrReuseType(item)
    yield [Write, ')']
  }
}
