import z from 'zod'
import { MenuModel } from '../../models/Menu'

export interface GetMenusInputDTO {
  token: string
}

export type GetMenusOutputDTO = MenuModel[]

export const GetMenusSchema = z.object({
  token: z.string().min(1)
}).transform(data => data as GetMenusInputDTO)