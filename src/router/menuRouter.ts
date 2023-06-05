import express from 'express'
import { MenuController } from '../controller/MenuController'
import { MenuBusiness } from '../business/MenuBusiness'
import { MenuDatabase } from '../database/MenuDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'

export const menuRouter = express.Router()

const menuController = new MenuController(
  new MenuBusiness(
    new MenuDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

menuRouter.post("/", menuController.createMenu)
menuRouter.get("/", menuController.getMenus)
menuRouter.put("/:id", menuController.editMenu)
menuRouter.delete("/:id", menuController.deleteMenu)

menuRouter.put("/:id/like", menuController.likeOrDislikeMenu)