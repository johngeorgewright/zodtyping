import { SymbolFlags, ts, Type } from 'ts-morph'
import generateOrReuseType from './generateOrReuseType'
import TypeWriter from './TypeWriter'
import { Import, Static, StaticParameters, Write } from './symbols'
import factory from './factory'

export default function* objectTypeWriter(type: Type): TypeWriter {
  if (isBuiltInType(type)) yield* generateBuildInType(type)
  else if (type.getStringIndexType()) yield* generateStringIndexType(type)
  else if (type.getNumberIndexType()) yield* generateNumberIndexType(type)
  else if (getGenerics(type).length) yield* generateObjectFunction(type)
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

function getGenerics(type: Type) {
  const typeArguments = type.getTypeArguments()
  const aliasTypeArguments = type.getAliasTypeArguments()
  return [...typeArguments, ...aliasTypeArguments]
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

function* generateObjectFunction(type: Type): TypeWriter {
  const generics = getGenerics(type)

  yield [Import, { alias: 'Infer', name: 'infer' }]
  yield [Import, 'ZodType']
  yield [Write, '<']

  for (const generic of generics) {
    const constraint = generic.getConstraint()
    const constraintDeclaredType = constraint?.getSymbol()?.getDeclaredType()

    yield [Write, `${generic.getText()} extends `]

    if (constraintDeclaredType) {
      yield [Write, 'Infer<typeof ']
      yield* generateOrReuseType(constraintDeclaredType)
      yield [Write, '>']
    } else yield [Write, constraint ? constraint.getText() : 'any']

    yield [Write, ', ']
  }

  yield [Write, '>(']

  for (const generic of generics)
    yield [Write, `${generic.getText()}: ZodType<${generic.getText()}>, `]

  yield [Write, ') => ']

  yield* generateObject(type)

  yield [
    StaticParameters,
    generics.map((generic) => {
      const constraint = generic.getConstraint()
      const constraintDeclaredType = constraint?.getSymbol()?.getDeclaredType()
      return {
        name: generic.getText(),
        constraint: constraintDeclaredType
          ? getTypeName(constraintDeclaredType)
          : constraint?.getText(),
      }
    }),
  ]

  yield [
    Static,
    `Infer<ReturnType<typeof ${getTypeName(type)}<${generics.map((generic) =>
      generic.getText()
    )}>>>`,
  ]
}

function* generateObject(type: Type): TypeWriter {
  yield [Import, 'object']
  yield [Write, 'object({']

  const typeArguments = getGenerics(type).map((typeArgument) =>
    typeArgument.getText()
  )

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
    if (!typeArguments.includes(propertyType.getText()))
      yield* generateOrReuseType(propertyType)
    else yield [Write, propertyType.getText()]
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

function getTypeName(type: Type) {
  return type.getAliasSymbol()?.getName() || type.getSymbolOrThrow().getName()
}
