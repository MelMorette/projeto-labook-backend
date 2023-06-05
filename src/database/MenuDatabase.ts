import { LikeDislikeDB, MENU_LIKE, MenuDB, MenuDBWithCreatorName } from "../models/Menu";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class MenuDatabase extends BaseDatabase {
  public static TABLE_MENUS = "menus"
  public static TABLE_LIKES_DISLIKES = "likes_dislikes"

  public insertMenu = async (
    menuDB: MenuDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(MenuDatabase.TABLE_MENUS)
      .insert(menuDB)
  }

  public getMenusWithCreatorName =
    async (): Promise<MenuDBWithCreatorName[]> => {

    const result = await BaseDatabase
      .connection(MenuDatabase.TABLE_MENUS)
      .select(
        `${MenuDatabase.TABLE_MENUS}.id`,
        `${MenuDatabase.TABLE_MENUS}.creator_id`,
        `${MenuDatabase.TABLE_MENUS}.name`,
        `${MenuDatabase.TABLE_MENUS}.likes`,
        `${MenuDatabase.TABLE_MENUS}.dislikes`,
        `${MenuDatabase.TABLE_MENUS}.created_at`,
        `${MenuDatabase.TABLE_MENUS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${MenuDatabase.TABLE_MENUS}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
    
    return result as MenuDBWithCreatorName[]
  }

  public findMenuById = async (
    id: string
  ): Promise<MenuDB | undefined> => {
    const [result] = await BaseDatabase
      .connection(MenuDatabase.TABLE_MENUS)
      .select()
      .where({ id })

    return result as MenuDB | undefined
  }

  public updateMenu = async (
    menuDB: MenuDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(MenuDatabase.TABLE_MENUS)
      .update(menuDB)
      .where({ id: menuDB.id })
  }

  public deleteMenuById = async (
    id: string
  ): Promise<void> => {
    await BaseDatabase
      .connection(MenuDatabase.TABLE_MENUS)
      .delete()
      .where({ id })
  }

  public findMenuWithCreatorNameById =
    async (id: string): Promise<MenuDBWithCreatorName | undefined> => {

    const [result] = await BaseDatabase
      .connection(MenuDatabase.TABLE_MENUS)
      .select(
        `${MenuDatabase.TABLE_MENUS}.id`,
        `${MenuDatabase.TABLE_MENUS}.creator_id`,
        `${MenuDatabase.TABLE_MENUS}.name`,
        `${MenuDatabase.TABLE_MENUS}.likes`,
        `${MenuDatabase.TABLE_MENUS}.dislikes`,
        `${MenuDatabase.TABLE_MENUS}.created_at`,
        `${MenuDatabase.TABLE_MENUS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${MenuDatabase.TABLE_MENUS}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${MenuDatabase.TABLE_MENUS}.id`]: id })
    
    return result as MenuDBWithCreatorName | undefined
  }

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<MENU_LIKE | undefined> => {

    const [result]: Array<LikeDislikeDB | undefined> = await BaseDatabase
      .connection(MenuDatabase.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeDislikeDB.user_id,
        menu_id: likeDislikeDB.menu_id
      })

    if (result === undefined) {
      return undefined

    } else if (result.like === 1) {
      return MENU_LIKE.ALREADY_LIKED
      
    } else {
      return MENU_LIKE.ALREADY_DISLIKED
    }
  }

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(MenuDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        menu_id: likeDislikeDB.menu_id
      })
  }

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(MenuDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        menu_id: likeDislikeDB.menu_id
      })
  }

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(MenuDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeDislikeDB)
  }
}
