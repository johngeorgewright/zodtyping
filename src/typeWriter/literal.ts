import { Type } from 'ts-morph'
import TypeWriter from './TypeWriter'
import { Import, Write } from './symbols'

export default function* literalTypeWriter(type: Type): TypeWriter {
  yield [Import, 'literal']
  yield [Write, `literal(${type.getText()})`]
}
