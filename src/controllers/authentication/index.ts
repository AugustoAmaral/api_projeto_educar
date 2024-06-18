import { Application } from "express";
import { AuthService } from "../../services/auth";

export class AuthController {
  private authService: AuthService;

  constructor(private app: Application) {
    this.authService = new AuthService();
    this.routes();
  }

  public routes() {
    this.app.post('/login', this.authService.login)
  }
}