import { Type } from 'ts-morph'
import factory from './factory'
import { DeclareType, Import, ImportFromSource, Write } from './symbols'
import TypeWriter from './TypeWriter'

export default function* lazyTypeWriter(type: Type, name?: string): TypeWriter {
  name = name || type.getSymbolOrThrow().getName()
  const alias = `_${name}`
  yield [Import, 'lazy']
  yield [Import, 'ZodType']
  yield [ImportFromSource, { alias, name }]
  yield [DeclareType, `ZodType<${alias}>`]
  yield [Write, 'lazy(() => ']
  yield* factory(type, name)
  yield [Write, ')']
}
