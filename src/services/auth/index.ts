import { Request, Response } from "express";
import { LoginModel } from "../../models/login";
const jwt = require('jsonwebtoken')

export class AuthService {
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json({
        error: 'Email não informado'
      })
    }

    if (!password) {
      return res.status(401).json({
        error: 'Senha não informada'
      })
    }

    const loginModel = new LoginModel(req.body) as any;

    const user = await loginModel.findByCredentials({ email, password }, res);
    delete user.password

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      })
    }

    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 1)

    const objToken = { 
      user: { 
        _id: user._id,
        name: user.name,
        email: user.email
      },
      expiration: expiration
    }


    const token = jwt.sign(objToken, process.env.JWT_KEY);

    return res.status(200).json({
      user,
      token
    })
  }
}

