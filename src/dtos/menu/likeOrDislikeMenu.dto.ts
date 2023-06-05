import z from 'zod'

export interface LikeOrDislikeMenuInputDTO {
  menuId: string,
  token: string,
  like: boolean
}

export type LikeOrDislikeMenuOutputDTO = undefined

export const LikeOrDislikeMenuSchema = z.object({
  menuId: z.string().min(1),
  token: z.string().min(1),
  like: z.boolean()
}).transform(data => data as LikeOrDislikeMenuInputDTO)
