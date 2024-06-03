import { Request, Response } from 'express';
import usersService from '../services/users.services';
import { handleHttp } from "../utils/error.handle";
import jwtService from '../utils/jwt.utils';

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersService.getUsers();
    res.send(users);
  } catch (error) {
    handleHttp(res, 500, "ERROR GET USERS");
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await usersService.createUser(req.body);
    res.send(user);
  } catch (error) {
    handleHttp(res, 500, "ERROR TO CREATE USERS");
    return new Error;
  }
};

const login = async (req: Request, res: Response) => {
  try {
      const credentials = req.body;
      const result = await usersService.login(credentials);

      if (result.error) {
          return res.status(400).json({ message: result.message });
      }

      const token = await jwtService.createToken(result.user);
      return res.status(200).json({ user: result.user, token });

  } catch (error) {
      console.error('Error in loginController:', error);
      return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
  }
};

const aceptAssistance = async (req: Request, res: Response) => {
  try {
    //  id es event id
    const { id } = req.params;
    const username = req.body.username;
    await usersService.aceptAssistance(id, username);
    res.status(204).end();
  } catch (error: any) {
    handleHttp(res, 500, "ERROR TO ACCEPT ASSISTANCE");
  }
}


const getEmailsfromUsernames = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usernames } = req.body;
    if (!Array.isArray(usernames)) {
      return res.status(400).json({ message: 'El formato de usernames es incorrecto. Debe ser un array de strings.' });
    }
    const emails = await usersService.getEmailsfromUsernames(usernames);
    return res.status(200).json(emails);
  } catch (error: any) {
    console.error('Error en getEmailsfromUsernames controller:', error);
    return res.status(500).json({ message: 'ERROR TO GET EMAILS FROM USERNAMES', error: error.message });
  }
}

export default {
  getUsers,
  createUser,
  login,
  aceptAssistance,
  getEmailsfromUsernames,
};