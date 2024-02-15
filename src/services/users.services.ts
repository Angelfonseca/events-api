import { get } from "http";
import { User } from "../interfaces/users.interface";
import UserModel from "../models/users.model";
import { handleHttp } from "../utils/error.handle";

const getUsers = async () => {
  const users = await UserModel.find();
  return users;
};

const createUser = async (user: User) => {
  const userData = await UserModel.create(user)
  return userData;
}
const getUserById = async (id: string) => {
  const user = await UserModel.findById(id);
  return user;
}

const getUsersEmail = async (email: string) => {
  const users = await getUsers()
  const usersEmail = users.map((user: any) => user.email)
  return usersEmail.includes(email)
}

const isMatchPassword = async (user: any, password: string) => {
  return new Promise((resolve, reject) => {
    user.comparePassword(password, function(err: any, isMatch: any) {
      if (err) reject(err);
      resolve(isMatch)
    });
  })
}

const getNoAdmins = async (): Promise<User[]> => {
  try {
    // Obtener todos los usuarios que no son administradores
    const users = await UserModel.find({ admin: false });

    // Convertir los documentos de Mongoose a objetos User
    const nonAdminUsers: User[] = users.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      admin: user.admin
    }));

    return nonAdminUsers;
  } catch (error: any) {
    throw new Error(`Error al obtener usuarios que no son administradores: ${error.message}`);
  }
};

const isAdmin = async (id: string): Promise<boolean> => {
  try {
      const user = await getUserById(id);

      if (user && user.admin) {
          return true;
      } else {
          return false;
      }
  } catch (error: any) {
      console.error(`Error al verificar si el usuario es un administrador: ${error.message}`);
      return false;
  }
};

const noAdmin = async (id: string): Promise<boolean> => {
  try {
      const user = await getUserById(id);

      if (user && user.admin) {
          return false;
      } else {
          return true;
      }
  } catch (error: any) {
      console.error(`Error al verificar si el usuario es un administrador: ${error.message}`);
      return false;
  }
}

const login = async (credentials: any) => {
  const user = await UserModel.findOne({ username: credentials.username });
  if (!user) {
    return { error: true, message: 'USER NOT FOUND' }
  }
  const matchPassword = await isMatchPassword(user, credentials.password);
  if (matchPassword) {
    return { error: false, user }
  }
  return { error: true, message: 'INVALID CREDENTIALS' }
}

export default {
  getUsers,
  createUser,
  login,
  getUserById,
  isAdmin,
  noAdmin,
  getNoAdmins,
};