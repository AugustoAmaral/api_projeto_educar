import { UserModel } from "../models/user";
const jwt = require('jsonwebtoken')

export async function auth(req: any, res: any, next: any) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      message: 'Token inválido'
    })
  }

  const data = jwt.verify(token, process.env.JWT_KEY);

  try {
    const user = await UserModel.findOne({ _id: data.user._id })
    if (!user) {
      return res.status(401).json({
        message: 'Token inválido'
      })
    }

    const expiration = new Date(data.expiration)
    const now = new Date()
    if (now > expiration) {
      return res.status(401).json({
        message: 'Token expirado'
      })
    }

    req.user = user
    req.token = token

    next()
  } catch (error) {
    res.status(401).json({ error: 'Você não tem autorização para acessar essa rota' })
  }
}