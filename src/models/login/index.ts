import { Response } from 'express';
import { model, Schema } from 'mongoose';
import { UserModel } from '../user';
import { Login } from './types';
const bcrypt = require('bcryptjs');

export const loginSchema = new Schema<Login>({
  email: { type: String, required: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

loginSchema.methods.findByCredentials = async (params: Login, res: Response) => {
  // Search for a user by email and password.
  const { email, password } = params;
  const user = await UserModel.findOne({ email }).lean()

  if (!user) {
    return res.status(400).json({
      message: 'Usuário não encontrado'
    })
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'Senha inválida'
    })
  }

  return user
}

export const LoginModel = model<Login>('Login', loginSchema);
