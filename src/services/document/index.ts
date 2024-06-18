import { Request, Response } from "express";
import { DocumentModel } from "../../models/document";
import { Document, Language, Type } from "../../models/document/types";
import { LibraryModel } from "../../models/library";
const formidable = require('formidable');
var fs = require('fs');
var path = require('path');
import { Types } from "mongoose";

export class DocumentService {
  public async upload(req: Request, res: Response) {
    const form = new formidable.IncomingForm();
    try {
      form.parse(req, (err: any, fields: any, files: any) => {
        const oldpath = files.file.filepath;
        const newpath = path.join(__dirname, '../../assets/documents', files.file.originalFilename);
        fs.renameSync(oldpath, newpath);
     
        res.status(200).json({
          message: 'Arquivo enviado com sucesso',
          pathName: newpath
        });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async download(req: Request, res: Response) {
    try {
      const file = path.join(__dirname, '../../assets/documents', req.params.id);
      res.download(file);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const documentInfo: Document = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        file: req.body.file,
        researchArea: req.body.researchArea,
        library: req.body.library,
        date: req.body.date,
        language: req.body.language,
        authors: req.body.authors,
        keywords: req.body.keywords
      }

      const document = new DocumentModel(documentInfo)

      const documentExists = await DocumentModel.findOne({ title: documentInfo.title });
      if (documentExists) {
        return res.status(409).json({
          message: `${documentExists.title} já está cadastrado`
        })
      }

      if (!Types.ObjectId.isValid(documentInfo.library)) {
        return res.status(409).json({
          message: `Id da biblioteca com formato inválido`
        })
      }

      const libraryExists = await LibraryModel.findById(documentInfo.library)

      if (!libraryExists) {
        return res.status(409).json({
          message: `Biblioteca não encontrada`
        })
      }

      const schemaValidationError = document.validateSync()
      if (schemaValidationError) {
        return res.status(500).json(schemaValidationError)
      }
      
      document.save()

      return res.status(200).json({
        message: `${documentInfo.type} criado com sucesso!`
      })
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  // public async getAll(req: Request, res: Response) {
  //   try {
  //     const page = req?.query?.page || 1
  //     const perPage = req?.query?.perPage || 20
  //     const dateStart = req?.query?.dateStart
  //     const dateEnd = req?.query?.dateEnd
  //     const type = req?.query?.type
  //     const title = req?.query?.title
  //     const researchArea = req?.query?.researchArea
  //     const library = req?.query?.library
  //     const language = req?.query?.language
  //     const authors = req?.query?.author
  //     const keywords = req?.query?.keyword

  //     const maxPages = Math.min(+perPage, 50)
  //     const skip = (+page - 1) * +perPage
    
  //     const filter: any = {}

  //     if (type) filter.type = type

  //     if (title) {
  //       filter.$or = [
  //         { title: { $regex: title, $options: 'gim ' } },
  //         { description: { $regex: title, $options: 'gim' } },
  //       ]
  //     }

  //     if (researchArea) filter.researchArea = { $regex: researchArea, $options: 'gim' }

  //     if (library) filter.library = library
  //     if (language) filter.language = language
  //     if (authors) filter.authors = authors
  //     if (keywords) filter.keywords = keywords
  //     if (dateStart && !dateEnd) filter.date = { $gte: dateStart }
  //     if (!dateStart && dateEnd) filter.date = { $lte: dateEnd }
  //     if (dateStart && dateEnd) {
  //       filter.$and = [
  //         {
  //           date: { $gte: dateStart }
  //         },
  //         {
  //           date: { $lte: dateEnd }
  //         }
  //       ]
  //     }

  //     const documents = await DocumentModel
  //       .find(filter)
  //       .skip(skip)
  //       .sort({ createdAt: -1 })
  //       .limit(maxPages)

  //     const totalSize = await DocumentModel.find(filter).count()

  //     return res.status(200).json({
  //       documents,
  //       totalSize
  //     })

  //   } catch (err) {
  //     return res.status(500).json(err)
  //   }
  // }

  
  public async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req?.query?.page as string) || 1;
      const perPage = parseInt(req?.query?.perPage as string) || 20;
      const dateStart = req?.query?.dateStart;
      const dateEnd = req?.query?.dateEnd;
      const type = req?.query?.type;
      const title = req?.query?.title;
      const researchArea = req?.query?.researchArea;
      const library = req?.query?.library;
      const language = req?.query?.language;
      const authors = req?.query?.author;
      const keywords = req?.query?.keyword;
  
      const maxPages = Math.min(perPage, 50);
      const skip = (page - 1) * perPage;
  
      const filter: any = {};
  
      if (type) filter.type = type;
  
      if (title) {
        filter.$or = [
          { title: { $regex: title, $options: 'i' } },
          { description: { $regex: title, $options: 'i' } }
        ];
      }
  
      if (researchArea) {
        filter.researchArea = { $regex: researchArea, $options: 'i' };
      }
  
      if (library) filter.library = library;
      if (language) filter.language = language;
  
      if (typeof authors === 'string') {
        filter.authors = { $in: authors.split(',') };
      }
  
      if (typeof keywords === 'string') {
        filter.keywords = { $in: keywords.split(',') };
      }
  
      if (dateStart && !dateEnd) {
        filter.date = { $gte: new Date(dateStart as string) };
      }
      if (!dateStart && dateEnd) {
        filter.date = { $lte: new Date(dateEnd as string) };
      }
      if (dateStart && dateEnd) {
        filter.date = { $gte: new Date(dateStart as string), $lte: new Date(dateEnd as string) };
      }
  
      const documents = await DocumentModel
        .find(filter)
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(maxPages);
  
      const totalSize = await DocumentModel.countDocuments(filter);
  
      return res.status(200).json({
        documents,
        totalSize
      });
  
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  

  public async get(req: Request, res: Response) {
    try {
      const documentId: string = req?.params?.id

      if (!documentId) return res.status(500).json({ message: 'ID não informado' })

      const document = await DocumentModel.findOne({ _id: documentId })

      return res.status(200).json({ document })

    } catch (err) {
      return res.status(500).json(err)
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const documentId: string = req?.params?.id
      if (!documentId) return res.status(500).json({ message: 'ID não informado' })

      const update = req.body
      const document = await DocumentModel.findOneAndUpdate({ _id: documentId }, update, { new: true })

      if (!document) return res.status(500).json({ message: 'Não foi possível encontrar' })
      return res.status(200).json({ document })
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const documentId: string = req?.params?.id
      if (!documentId) return res.status(500).json({ message: 'ID não informado' })

      const document = await DocumentModel.findOneAndDelete({ _id: documentId })

      if (!document) return res.status(500).json({ message: 'Não foi possível encontrar' })
      return res.status(200).json({ message: `Artigo ${documentId} deletado com sucesso` })

    } catch (err) {
      return res.status(500).json(err)
    }
  }

  public async getLanguages(req: Request, res: Response) {
    try {
      const languages = Object.keys(Language).map(key => Language[key as keyof typeof Language])
      return res.status(200).json({ languages })
    } catch (err) {
      return res.status(500).json(err)
    }
  }

  public async getTypes(req: Request, res: Response) {
    try {
      const types = Object.keys(Type).map(key => Type[key as keyof typeof Type])
      return res.status(200).json({ types })
    } catch (err) {
      return res.status(500).json(err)
    }
  }
}
