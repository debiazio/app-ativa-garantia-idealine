declare module 'co-body' {
  export function json(req: unknown): Promise<Record<string, unknown>>
}
