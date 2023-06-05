import z from 'zod'

export interface DeleteMenuInputDTO {
  token: string,
  idToDelete: string
}

export type DeleteMenuOutputDTO = undefined

export const DeleteMenuSchema = z.object({
  token: z.string().min(1),
  idToDelete: z.string().min(1)
})