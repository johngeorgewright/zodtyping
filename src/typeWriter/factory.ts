import { Type } from 'ts-morph'
import arrayTypeWriter from './array'
import enumTypeWriter from './enum'
import functionTypeWriter from './function'
import intersecionTypeWriter from './intersection'
import literalTypeWriter from './literal'
import objectTypeWriter from './object'
import simpleTypeWriter from './simple'
import tupleTypeWriter from './tuple'
import unionTypeWriter from './union'

export default function factory(type: Type, name?: string) {
  switch (true) {
    case type.isNull():
      return simpleTypeWriter('null')

    case type.isString():
      return simpleTypeWriter('string')

    case type.isNumber():
      return simpleTypeWriter('number')

    case type.isBoolean():
      return simpleTypeWriter('boolean')

    case type.isArray():
      return arrayTypeWriter(type)

    case type.isTuple():
      return tupleTypeWriter(type)

    case type.isEnum():
      return enumTypeWriter(type)

    case type.isIntersection():
      return intersecionTypeWriter(type)

    case type.isUnion():
      return unionTypeWriter(type)

    case type.isLiteral():
      return literalTypeWriter(type)

    case type.isAny():
    case type.isUnknown():
      return simpleTypeWriter('unknown')

    case type.isUndefined():
      return simpleTypeWriter('undefined')

    case type.getText() === 'void':
      return simpleTypeWriter('void')

    case type.getCallSignatures().length > 0:
      return functionTypeWriter(type, name)

    case type.isInterface():
    case type.isObject():
      return objectTypeWriter(type)

    default:
      throw new Error('!!! TYPE ' + type.getText() + ' NOT PARSED !!!')
  }
}
