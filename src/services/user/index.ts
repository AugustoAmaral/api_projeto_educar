import { Request, Response } from "express";
import { UserModel } from "../../models/user";
import { UserResponse } from "../../models/user/types";
import { isEmail } from "./validators";
const jwt = require('jsonwebtoken')

export class UserService {
  public async create(req: Request, res: Response) {
    try {
      const user = new UserModel(req.body);

      if (!isEmail(user.email)) {
        return res.status(400).json({
          message: 'Email inválido'
        });
      }

      const userExists = await UserModel.findOne({ email: user.email });

      if (userExists) {
        return res.status(409).json({
          message: "Usuário já cadastrado"
        })
      }

      await user.save();

      res.status(200).json({
        sucess: true,
      });
    }
    catch (error) {
      res.status(500).json({
        sucess: false,
        error
      })
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const usersDb = await UserModel.find({});
      let users: UserResponse[] = [];
      usersDb.forEach(user => {
        users.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        });
      })
      res.status(200).json({
        users
      });
    }
    catch (error) {
      res.status(500).json({
        error
      })
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    }
    catch (error) {
      res.status(500).json({
        error
      })
    }
  }

  public async update(req: Request, res: Response) {
    try {
      if (!isEmail(req.body.email)) {
        return res.status(400).json({
          message: 'Email inválido'
        });
      }

      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        user
      });
    }
    catch (error) {
      res.status(500).json({
        error
      })
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        message: 'Usuário deletado com sucesso'
      });
    }
    catch (error) {
      res.status(500).json({
        error
      })
    }
  }

  public async get(req: any, res: Response) {
    try {
      const user: UserResponse = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      };

      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado'
        });
      }

      return res.status(200).json({
        user
      });
    }
    catch (error) {
      res.status(500).json({
        error
      })
    }

  }
}

