import { Type } from 'ts-morph'
import generateOrReuseType from './generateOrReuseType'
import TypeWriter from './TypeWriter'
import { Import, Write } from './symbols'

export default function* tupleTypeWriter(type: Type): TypeWriter {
  yield [Import, 'tuple']
  yield [Write, 'tuple(']
  for (const element of type.getTupleElements()) {
    yield* generateOrReuseType(element)
    yield [Write, ',']
  }
  yield [Write, ')']
}
