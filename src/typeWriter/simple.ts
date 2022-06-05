import TypeWriter from './TypeWriter'
import { Import, Write } from './symbols'
import * as zod from 'zod'

const primitiveNames = ['any', 'never', 'null', 'undefined', 'unknown', 'void']

export default function* simpleTypeWriter(type: keyof typeof zod): TypeWriter {
  if (primitiveNames.includes(type)) {
    const alias = capitalize(type)
    yield [Import, { name: type, alias }]
    yield [Write, `${alias}()`]
  } else {
    yield [Import, type]
    yield [Write, `${type}()`]
  }
}

function capitalize(x: string) {
  return x.replace(/^[a-z]/, (x) => x.toUpperCase())
}
