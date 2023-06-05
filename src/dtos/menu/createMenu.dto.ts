import z from 'zod'

export interface CreateMenuInputDTO {
  name: string,
  token: string
}

export type CreateMenuOutputDTO = undefined

export const CreateMenuSchema = z.object({
  name: z.string().min(1),
  token: z.string().min(1)
}).transform(data => data as CreateMenuInputDTO)