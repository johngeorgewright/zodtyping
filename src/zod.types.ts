import { array, boolean, infer as Infer, object, string } from 'zod'

export const InstructionSourceType = object({
  file: string(),
  exportStaticType: boolean().optional(),
  type: string().or(array(string())),
})

export type InstructionSourceType = Infer<typeof InstructionSourceType>

export const Instruction = object({
  runtypeFormat: string().optional(),
  sourceTypes: InstructionSourceType.or(array(InstructionSourceType)),
  targetFile: string(),
  typeFormat: string().optional(),
})

export type Instruction = Infer<typeof Instruction>

export const Instructions = Instruction.or(array(Instruction))

export type Instructions = Infer<typeof Instructions>
