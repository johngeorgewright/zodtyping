import {
  Project,
  VariableDeclarationKind,
  SourceFile,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  EnumDeclaration,
  SyntaxKind,
} from 'ts-morph'
import { Instruction, InstructionSourceType } from './types'
import RuntypeGenerator, {
  Import,
  UseIdentifier,
  Write,
} from './RuntypeGenerator'

export default function* generate({
  buildInstructions,
  project,
}: {
  buildInstructions: Instruction[]
  project: Project
}) {
  for (const buildInstruction of buildInstructions) {
    const imports = new Set<string>()
    const exports = new Set<string>()
    const targetFile = project.createSourceFile(
      buildInstruction.targetFile,
      '',
      { overwrite: true }
    )

    for (const sourceType of buildInstruction.sourceTypes) {
      generateRuntype(project, sourceType, targetFile, imports, exports)
    }

    targetFile.addImportDeclaration({
      namedImports: [...imports],
      moduleSpecifier: 'runtypes',
    })

    targetFile.formatText()
    yield targetFile
  }
}

function generateRuntype(
  project: Project,
  sourceType: InstructionSourceType,
  targetFile: SourceFile,
  imports: Set<string>,
  exports: Set<string>
) {
  const sourceFile = project.addSourceFileAtPath(sourceType.file)
  const typeDeclaration = getTypeDeclaration(sourceFile, sourceType.type)
  let writer = project.createWriter()
  const recursive = isRecursive(typeDeclaration)
  const generator = RuntypeGenerator.generateType(
    typeDeclaration.getType(),
    (type) => recursive || hasTypeDeclaration(sourceFile, type),
    recursive
  )

  for (const item of generator) {
    switch (item[0]) {
      case Write:
        writer = writer.write(item[1])
        break
      case Import:
        imports.add(item[1])
        break
      case UseIdentifier:
        if (!exports.has(item[1]) && !recursive)
          generateRuntype(
            project,
            {
              file: sourceType.file,
              type: item[1],
            },
            targetFile,
            imports,
            exports
          )
        break
    }
  }

  targetFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: sourceType.type,
        initializer: writer.toString(),
      },
    ],
  })

  imports.add('Static')

  targetFile.addTypeAlias({
    isExported: true,
    name: sourceType.type,
    type: `Static<typeof ${sourceType.type}>`,
  })

  exports.add(sourceType.type)
}

function getTypeDeclaration(sourceFile: SourceFile, sourceType: string) {
  try {
    return sourceFile.getInterfaceOrThrow(sourceType)
  } catch (error) {}

  try {
    return sourceFile.getTypeAliasOrThrow(sourceType)
  } catch (error) {}

  try {
    return sourceFile.getEnumOrThrow(sourceType)
  } catch (error) {
    throw new Error(
      `Cannot find any interface, type or enum called "${sourceType}" in ${sourceFile.getFilePath()}.`
    )
  }
}

function hasTypeDeclaration(sourceFile: SourceFile, sourceType: string) {
  try {
    return !!getTypeDeclaration(sourceFile, sourceType)
  } catch (error) {
    return false
  }
}

function isRecursive(
  typeDeclaration: InterfaceDeclaration | TypeAliasDeclaration | EnumDeclaration
) {
  const name = typeDeclaration.getName()

  for (const node of typeDeclaration.getDescendantsOfKind(
    SyntaxKind.TypeReference
  )) {
    if (node.getText() === name) return true
  }

  return false
}
