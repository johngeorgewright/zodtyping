export interface A {
  (foo: string, bar: number): void
}

export type B = (bar: number) => void

export interface C {
  (foo: string): B
  (foo: string, bar: number): void
  (foo: string, bar?: number): any
}

export function D(foo: number) {
  return foo + 'foo'
}

export async function E(foo: number) {
  return D(foo)
}

export const F = (foo: number) => foo.toString()
