import { MenuDatabase } from "../database/MenuDatabase";
import { CreateMenuInputDTO, CreateMenuOutputDTO } from "../dtos/menu/createMenu.dto";
import { DeleteMenuInputDTO, DeleteMenuOutputDTO } from "../dtos/menu/deleteMenu.dto";
import { EditMenuInputDTO, EditMenuOutputDTO } from "../dtos/menu/editMenu.dto";
import { GetMenusInputDTO, GetMenusOutputDTO } from "../dtos/menu/getMenus.dto";
import { LikeOrDislikeMenuInputDTO, LikeOrDislikeMenuOutputDTO } from "../dtos/menu/likeOrDislikeMenu.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, MENU_LIKE, Menu } from "../models/Menu";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class MenuBusiness {
  constructor(
    private menuDatabase: MenuDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createMenu = async (
    input: CreateMenuInputDTO
  ): Promise<CreateMenuOutputDTO> => {
    const { name, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const id = this.idGenerator.generate()

    const menu = new Menu(
      id,
      name,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.name
    )

    const menuDB = menu.toDBModel()
    await this.menuDatabase.insertMenu(menuDB)

    const output: CreateMenuOutputDTO = undefined

    return output
  }

  public getMenus = async (
    input: GetMenusInputDTO
  ): Promise<GetMenusOutputDTO> => {
    const { token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const menusDBwithCreatorName =
      await this.menuDatabase.getMenusWithCreatorName()
    
    const menus = menusDBwithCreatorName
      .map((menuWithCreatorName) => {
        const menu = new Menu(
          menuWithCreatorName.id,
          menuWithCreatorName.name,
          menuWithCreatorName.likes,
          menuWithCreatorName.dislikes,
          menuWithCreatorName.created_at,
          menuWithCreatorName.updated_at,
          menuWithCreatorName.creator_id,
          menuWithCreatorName.creator_name
        )

        return menu.toBusinessModel()
    })

    const output: GetMenusOutputDTO = menus

    return output
  }

  public editMenu = async (
    input: EditMenuInputDTO
  ): Promise<EditMenuOutputDTO> => {
    const { name, token, idToEdit } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const menuDB = await this.menuDatabase
      .findMenuById(idToEdit)

    if (!menuDB) {
      throw new NotFoundError("menu com essa id não existe")
    }

    if (payload.id !== menuDB.creator_id) {
      throw new ForbiddenError("somente quem criou a menu pode editá-la")
    }

    const menu = new Menu(
      menuDB.id,
      menuDB.name,
      menuDB.likes,
      menuDB.dislikes,
      menuDB.created_at,
      menuDB.updated_at,
      menuDB.creator_id,
      payload.name
    )

    menu.setName(name)

    const updatedMenuDB = menu.toDBModel()
    await this.menuDatabase.updateMenu(updatedMenuDB)

    const output: EditMenuOutputDTO = undefined

    return output
  }

  public deleteMenu = async (
    input: DeleteMenuInputDTO
  ): Promise<DeleteMenuOutputDTO> => {
    const { token, idToDelete } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const menuDB = await this.menuDatabase
      .findMenuById(idToDelete)

    if (!menuDB) {
      throw new NotFoundError("menu com essa id não existe")
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== menuDB.creator_id) {
        throw new ForbiddenError("somente quem criou a menu pode editá-la")
      }
    }

    await this.menuDatabase.deleteMenuById(idToDelete)

    const output: DeleteMenuOutputDTO = undefined

    return output
  }

  public likeOrDislikeMenu = async (
    input: LikeOrDislikeMenuInputDTO
  ): Promise<LikeOrDislikeMenuOutputDTO> => {
    const { token, like, menuId } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const menuDBWithCreatorName =
      await this.menuDatabase.findMenuWithCreatorNameById(menuId)

    if (!menuDBWithCreatorName) {
      throw new NotFoundError("menu com essa id não existe")
    }

    const menu = new Menu(
      menuDBWithCreatorName.id,
      menuDBWithCreatorName.name,
      menuDBWithCreatorName.likes,
      menuDBWithCreatorName.dislikes,
      menuDBWithCreatorName.created_at,
      menuDBWithCreatorName.updated_at,
      menuDBWithCreatorName.creator_id,
      menuDBWithCreatorName.creator_name
    )

    const likeSQlite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      menu_id: menuId,
      like: likeSQlite
    }

    const likeDislikeExists =
      await this.menuDatabase.findLikeDislike(likeDislikeDB)

    if (likeDislikeExists === MENU_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.menuDatabase.removeLikeDislike(likeDislikeDB)
        menu.removeLike()
      } else {
        await this.menuDatabase.updateLikeDislike(likeDislikeDB)
        menu.removeLike()
        menu.addDislike()
      }

    } else if (likeDislikeExists === MENU_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.menuDatabase.removeLikeDislike(likeDislikeDB)
        menu.removeDislike()
      } else {
        await this.menuDatabase.updateLikeDislike(likeDislikeDB)
        menu.removeDislike()
        menu.addLike()
      }

    } else {
      await this.menuDatabase.insertLikeDislike(likeDislikeDB)
      like ? menu.addLike() : menu.addDislike()
    }

    const updatedMenuDB = menu.toDBModel()
    await this.menuDatabase.updateMenu(updatedMenuDB)

    const output: LikeOrDislikeMenuOutputDTO = undefined

    return output
  }
}
