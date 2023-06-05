import { Request, Response } from "express";
import { MenuBusiness } from "../business/MenuBusiness";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { CreateMenuSchema } from "../dtos/menu/createMenu.dto";
import { GetMenusSchema } from "../dtos/menu/getMenus.dto";
import { EditMenuSchema } from "../dtos/menu/editMenu.dto";
import { DeleteMenuSchema } from "../dtos/menu/deleteMenu.dto";
import { LikeOrDislikeMenuSchema } from "../dtos/menu/likeOrDislikeMenu.dto";

export class MenuController {
  constructor(
    private menuBusiness: MenuBusiness
  ) {}

  public createMenu = async (req: Request, res: Response) => {
    try {
      const input = CreateMenuSchema.parse({
        name: req.body.name,
        token: req.headers.authorization
      })

      const output = await this.menuBusiness.createMenu(input)

      res.status(201).send(output)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public getMenus = async (req: Request, res: Response) => {
    try {
      const input = GetMenusSchema.parse({
        token: req.headers.authorization
      })

      const output = await this.menuBusiness.getMenus(input)

      res.status(200).send(output)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public editMenu = async (req: Request, res: Response) => {
    try {
      const input = EditMenuSchema.parse({
        token: req.headers.authorization,
        name: req.body.name,
        idToEdit: req.params.id
      })

      const output = await this.menuBusiness.editMenu(input)

      res.status(200).send(output)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public deleteMenu = async (req: Request, res: Response) => {
    try {
      const input = DeleteMenuSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id
      })

      const output = await this.menuBusiness.deleteMenu(input)

      res.status(200).send(output)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public likeOrDislikeMenu = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeMenuSchema.parse({
        token: req.headers.authorization,
        menuId: req.params.id,
        like: req.body.like
      })

      const output = await this.menuBusiness.likeOrDislikeMenu(input)

      res.status(200).send(output)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
}