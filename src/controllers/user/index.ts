import { Application } from "express";
import { admin } from "../../middlewares/admin";
import { auth } from "../../middlewares/auth";
import { UserService } from "../../services/user";

export class UserController {
  private userService: UserService;

  constructor(private app: Application) {
    this.userService = new UserService();
    this.routes();
  }

  public routes() {
    this.app.post('/user', auth, this.userService.create);
    this.app.get('/user', auth, this.userService.get);
    this.app.get('/users', auth, this.userService.getAll);
    this.app.get('/user/:id', auth, this.userService.getById);
    this.app.put('/user/:id', auth, this.userService.update);
    this.app.delete('/user/:id', admin, this.userService.delete);
  }
}