import { Application } from "express";
import { auth } from "../../middlewares/auth";
import { LibraryService } from "../../services/library";

export class LibraryController {
  private libraryService: LibraryService;

  constructor(private app: Application) {
    this.libraryService = new LibraryService();
    this.routes();
  }

  public routes() {
    this.app.post('/library', auth, this.libraryService.create)
    this.app.get('/libraries', this.libraryService.getAll)
  }
}