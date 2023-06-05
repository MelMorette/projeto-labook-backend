import z from 'zod'

export interface EditMenuInputDTO {
  name: string,
  token: string,
  idToEdit: string
}

export type EditMenuOutputDTO = undefined

export const EditMenuSchema = z.object({
  name: z.string().min(1),
  token: z.string().min(1),
  idToEdit: z.string().min(1)
}).transform(data => data as EditMenuInputDTO)