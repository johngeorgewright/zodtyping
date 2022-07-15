import { Type } from 'ts-morph'
import factory from './factory'
import { Import, Write } from './symbols'
import TypeWriter from './TypeWriter'

export default function* lazyTypeWriter(type: Type, name?: string): TypeWriter {
  yield [Import, 'lazy']
  yield [Write, 'lazy(() => ']
  yield* factory(type, name || type.getSymbol()?.getName())
  yield [Write, ')']
}
