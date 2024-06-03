import { register } from "module";
import { Admin } from "../interfaces/admin.interface";
import { User } from "../interfaces/users.interface";
import AdminModel from "../models/admin.model";
import userModel from "../models/users.model";
import registerLog from "../models/registerLog.model";
import EventModel from "../models/events.model";

const getAdmins = async (): Promise<Admin[]> => {
    const admins = await AdminModel.find();
    return admins;
};

const getAdminById = async (id: string): Promise<Admin> => {
    const admin = await AdminModel.findById(id);
    if (!admin) {
        throw new Error(`No se encontró el administrador con el ID proporcionado.`);
    }
    return admin;
};

const createAdmin = async (admin: Admin): Promise<Admin> => {
    const newAdmin = await AdminModel.create(admin);
    return newAdmin;
};

const updateAdmin = async (id: string, admin: Admin): Promise<Admin | null> => {
    const updatedAdmin = await AdminModel.findByIdAndUpdate(id, admin, { new: true });
    return updatedAdmin;
}

const deleteAdmin = async (id: string): Promise<Admin | null> => {
    const deletedAdmin = await AdminModel.findByIdAndDelete(id);
    return deletedAdmin;
}

const getAdminByUsername = async (username: string): Promise<Admin> => {
    const admin = await AdminModel.findOne({ username: username });
    if (!admin) {
        throw new Error(`No se encontró el administrador con el nombre de usuario proporcionado.`);
    }
    return admin;
};

const isDocente = async (id: string): Promise<boolean> => {
    const admin = await AdminModel.findById(id);
    if (admin && admin.isdocente === true) {
        return true;
    }
    return false;
}

const getUserEvents = async (username: string) => {
    const student = await userModel.findOne({ username: username });
    if (!student) {
        throw new Error(`No se encontró el usuario con el nombre de usuario proporcionado.`);
    }

    try {
        const studentEvents = await registerLog.find({ UsersAssistance: { $in: [student.username] } });
        return studentEvents;
    } catch (error: any) {
        console.log(`Error al obtener los eventos del usuario: ${error.message}`);
        throw new Error(`Error al obtener los eventos del usuario: ${error.message}`);
    }
}
const getUserswithcredit = async () => {
    const students = await userModel.find();
    if (!students) {
        throw new Error(`No se encontró ningún usuario.`);
    }
    try {
        for (const student of students) {
            const studentEvents = await registerLog.find({ UsersAssistance: { $in: [student.username] }, duration: {} });
            const hours = studentEvents.reduce((acc, curr) => acc + curr.duration, 0);
            if (hours > 10) {
                return student;
            }
        }
    } catch (error: any) {
        console.log(`Error al obtener los eventos del usuario: ${error.message}`);
        throw new Error(`Error al obtener los eventos del usuario: ${error.message}`);
    }
}

const getUserHours = async (id: string) => {
    const student = await userModel.findById(id);
    if (!student) {
        throw new Error(`No se encontró el usuario con el ID proporcionado.`);
    }
    try {
        const studentEvents = await registerLog.find({ UsersAssistance: { $in: [student.username] }, duration: {} });
        const hours = studentEvents.reduce((acc, curr) => acc + curr.duration, 0);
        return hours;
    } catch (error: any) {
        console.log(`Error al obtener los eventos del usuario: ${error.message}`);
        throw new Error(`Error al obtener los eventos del usuario: ${error.message}`);
    }
}

export default {
    getAdmins,
    getAdminById,
    isDocente,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByUsername,
    getUserEvents,
    getUserswithcredit,
    getUserHours
};

