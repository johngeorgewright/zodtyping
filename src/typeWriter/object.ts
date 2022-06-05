import { SymbolFlags, ts, Type } from 'ts-morph'
import generateOrReuseType from './generateOrReuseType'
import TypeWriter from './TypeWriter'
import { Import, Write } from './symbols'

export default function* objectTypeWriter(type: Type): TypeWriter {
  if (isBuiltInType(type)) yield* generateBuildInType(type)
  else if (type.getStringIndexType()) yield* generateStringIndexType(type)
  else if (type.getNumberIndexType()) yield* generateNumberIndexType(type)
  else yield* generateObject(type)
}

function isBuiltInType(type: Type) {
  return type
    .getSymbolOrThrow()
    .getDeclarations()
    .some((d) => {
      if (d.getSourceFile().compilerNode.hasNoDefaultLib) {
        const name = type.getSymbolOrThrow().getName()
        const parent = d.getParentOrThrow()
        const siblings = (
          [
            ts.SyntaxKind.ClassDeclaration,
            ts.SyntaxKind.FunctionDeclaration,
            ts.SyntaxKind.VariableDeclaration,
          ] as const
        ).flatMap((x) => parent.getChildrenOfKind(x))
        return siblings.some((x) => x.getName() === name)
      }
      return false
    })
}

function* generateBuildInType(type: Type): TypeWriter {
  yield [Import, { name: 'instanceof', alias: 'InstanceOf' }]
  yield [Write, `InstanceOf(${type.getText()})`]
}

function* generateStringIndexType(type: Type): TypeWriter {
  yield [Import, 'record']
  yield [Import, 'string']
  yield [Write, 'record(string(), ']
  yield* generateOrReuseType(type.getStringIndexType()!)
  yield [Write, ')']
}

function* generateNumberIndexType(type: Type): TypeWriter {
  yield [Import, 'record']
  yield [Import, 'number']
  yield [Write, 'record(number(), ']
  yield* generateOrReuseType(type.getNumberIndexType()!)
  yield [Write, ')']
}

function* generateObject(type: Type): TypeWriter {
  yield [Import, 'object']
  yield [Write, 'object({']

  for (const property of type.getProperties()) {
    yield [
      Write,
      `${
        propNameRequiresQuotes(property.getName())
          ? `[\`${escapeQuottedPropName(property.getName())}\`]`
          : property.getName()
      }:`,
    ]
    const propertyType = property.getValueDeclarationOrThrow().getType()
    yield* generateOrReuseType(propertyType)
    if (property.hasFlags(SymbolFlags.Optional)) yield [Write, '.optional()']
    yield [Write, ',']
  }

  yield [Write, '})']
}

function propNameRequiresQuotes(propName: string) {
  return !/^[\$_[a-zA-Z][\$\w]*$/.test(propName)
}

function escapeQuottedPropName(propName: string) {
  return propName.replace(/\$/g, '\\$')
}
