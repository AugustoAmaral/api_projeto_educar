import { Application } from "express";
import { auth } from "../../middlewares/auth";
import { DocumentService } from "../../services/document";

export class DocumentController {
  private documentService: DocumentService;

  constructor(private app: Application) {
    this.documentService = new DocumentService();
    this.routes();
  }

  public routes() {
    this.app.post('/document/upload', auth, this.documentService.upload);
    this.app.get('/document/download/:id', this.documentService.download);
    this.app.post('/document', auth, this.documentService.create);
    this.app.get('/documents', this.documentService.getAll);
    this.app.get('/document/:id', this.documentService.get);
    this.app.put('/document/:id', auth, this.documentService.update);
    this.app.delete('/document/:id', auth, this.documentService.delete);
    this.app.get('/documents/languages', this.documentService.getLanguages);
    this.app.get('/documents/types', this.documentService.getTypes);
  }
}