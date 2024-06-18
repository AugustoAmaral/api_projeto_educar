import cors from 'cors';
import express, { Application } from 'express';
import { DocumentController } from './controllers/document';
import { AuthController } from './controllers/authentication';
import { UserController } from './controllers/user';
import { LibraryController } from './controllers/library';
const mongoose = require('mongoose');
class App {
  public app: Application;

  //declaring our controller
  public userController: UserController;
  public authController: AuthController;
  public documentController: DocumentController;
  public libraryController: LibraryController;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();

    //Creating and assigning a new instance of our controller
    this.userController = new UserController(this.app);
    this.authController = new AuthController(this.app);
    this.documentController = new DocumentController(this.app);
    this.libraryController = new LibraryController(this.app);
  }

  private setConfig() {
    //Allows us to receive requests with data in json format
    this.app.use(express.json({ limit: '50mb' }));

    //Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));

    //Enables cors   
    this.app.use(cors());

    console.log(this.app.get('env'))
  }

  //Connecting to our MongoDB database
  private async setMongoConfig() {
    try {;

      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
      });

      console.log('Conectado')
    } catch (error) {
      console.log(error);
    }
  }
}

export default new App().app;