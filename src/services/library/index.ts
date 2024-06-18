import { Library } from "../../models/library/types";
import { Request, Response } from "express";
import { LibraryModel } from "../../models/library";

export class LibraryService {
  public async create (req: Request, res: Response) {
    try {
      const libraryInfo: Library = {
        name: req.body.name,
        description: req.body.description,
        slug: req.body.slug
      }
      
      const library = new LibraryModel(libraryInfo)
      const libraryExists = await LibraryModel.findOne({
        name: libraryInfo.name,
        slug: libraryInfo.slug
      })

      if (libraryExists) {
        return res.status(400).json({
          message: 'Biblioteca já existe'
        })
      }

      await library.save()

      return res.status(200).json({
        message: 'Biblioteca criada com sucesso!'
      })
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  public async getAll (req: Request, res: Response) {
    try {
      const libraries = await LibraryModel
        .find()
        .limit(100)

      return res.status(200).json({ libraries })
    } catch (err) {
      return res.status(500).json(err)
    }
  }
  
}
