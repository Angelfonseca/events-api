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

const getNoAdminsEmail = async (req: Request, res: Response) => {
  try {
    const emails = await usersService.getNoAdminsEmail();
    res.send(emails);
  } catch (error) {
    handleHttp(res, 500, "ERROR TO GET NO ADMINS EMAIL");
  }
};
const login = async (req: Request, res: Response) => {
  try {
    const user = await usersService.login(req.body);
    if (user.error) {
      return handleHttp(res, 500, user.message || 'ERROR TO LOGIN');
    }
    const data = {
      user: user.user,
      token: await jwtService.createToken(user.user)
    }
    res.send(data);
  } catch (error) {
    console.log(error)
    handleHttp(res, 500, "ERROR TO LOGIN USER");
  }
};

export default {
  getUsers,
  createUser,
  login,
  getNoAdminsEmail,
};