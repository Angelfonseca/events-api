import { Admin } from "../interfaces/admin.interface";
import AdminModel from "../models/admin.model";

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

const isDocente = async (username: string): Promise<boolean> => {
    const admin = await AdminModel.findOne({ username: username });
    if (admin) {
        return true;
    }
    return false;
}

export default {
    getAdmins,
    getAdminById,
    isDocente,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByUsername
};

