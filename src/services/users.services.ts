import { get } from "http";
import { User } from "../interfaces/users.interface";
import UserModel from "../models/users.model";
import AdminModel from "../models/admin.model";
import { handleHttp } from "../utils/error.handle";
import EventModel from "../models/events.model";

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
  for (const user of users) {
    if (user.email === email) {
      return user.email
    }
  }
  return null
}

const login = async (credentials: any) => {
  let user = await UserModel.findOne({ username: credentials.username });
  console.log('Checking UserModel:', user);

  if (!user) {
      user = await AdminModel.findOne({ username: credentials.username });
      console.log('Checking AdminModel:', user);

      if (!user) {
          return { error: true, message: 'USER NOT FOUND' };
      }
  }

  const isPasswordMatch = await isMatchPassword(user, credentials.password);
  console.log('Password match result:', isPasswordMatch);

  if (!isPasswordMatch) {
      return { error: true, message: 'INVALID CREDENTIALS' };
  }

  return { error: false, message: 'LOGIN SUCCESSFUL', user };
};

const isMatchPassword = async (user: any, password: string) => {
  return new Promise((resolve, reject) => {
      user.comparePassword(password, (err: any, isMatch: any) => {
          if (err) return reject(err);
          resolve(isMatch);
      });
  });
};

const getNoAdmins = async (): Promise<User[]> => {
    const users = await UserModel.find({ admin: false });
    const nonAdminUsers: User[] = users.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      admin: user.admin,
      career: user.career,
      semester: user.semester
    }));
    return nonAdminUsers;
};

const getNoAdminsEmail = async (): Promise<string[]> => {
  const users = await getNoAdmins();
  const emails = users.map((user: any) => user.email);
  return emails;
};

const aceptAssistance = async (id: string, username: string) => {
  const event = await EventModel.findById(id);
  if (!event) {
      throw new Error(`No se encontró el evento con el ID proporcionado.`);
  }
  event.aceptedAssistance.push(username);
  await event.save();
  return event;
}
const getEmailfromUsername = async (username: string): Promise<string> => {
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      throw new Error(`No se encontró el usuario con el nombre de usuario proporcionado: ${username}`);
    }
    return user.email;
  } catch (error) {
    console.error(`Error al obtener el email para el username: ${username}`, error);
    throw error; // Re-lanzar el error para que sea capturado por la función que llama
  }
}

const getEmailsfromUsernames = async (usernames: string[]): Promise<string[]> => {
  try {
    const emails = await Promise.all(usernames.map(async (username) => {
      try {
        return await getEmailfromUsername(username);
      } catch (error) {
        console.error(`Error en getEmailfromUsername para el username: ${username}`, error);
        throw error; // Opcional: puedes decidir cómo manejar errores específicos aquí
      }
    }));
    return emails;
  } catch (error) {
    console.error('Error al obtener emails de los usernames', error);
    throw error; // Re-lanzar el error para que sea manejado en el nivel superior
  }
}
export default {
  getUsers,
  createUser,
  login,
  getUserById,
  getNoAdmins,
  getNoAdminsEmail,
  aceptAssistance,
  getEmailsfromUsernames,
};