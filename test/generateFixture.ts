import * as pathHelper from 'path'
import { Project } from 'ts-morph'
import Generator, { GeneratorOptions } from '../src/Generator'
import * as ts from 'typescript'

export default async function generateFixture(
  name: string,
  types: string[],
  {
    exportStaticType,
    generatorOpts,
    project,
  }: {
    exportStaticType?: boolean
    project?: Project
    generatorOpts?: Partial<GeneratorOptions>
  } = {}
) {
  const generator = new Generator({
    targetFile: pathHelper.join(__dirname, `${name}.zod.ts`),
    project,
    ...generatorOpts,
  })

  const sourceFile = await generator.generate([
    {
      exportStaticType,
      file: pathHelper.join(__dirname, `${name}.ts`),
      type: types,
    },
  ])

  const js = ts.transpile(sourceFile.getText())

  try {
    eval(js)
  } catch (error) {
    console.info('=== TS ===\n' + sourceFile.getText())
    console.info('=== JS ===\n' + js)
    throw error
  }

  return sourceFile
}
