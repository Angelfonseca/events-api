
import { RegisterLog } from "../interfaces/registerLog.interface";
import rlModel from "../models/users.model";
import { handleHttp } from "../utils/error.handle";
import { User } from "../interfaces/users.interface";
import { Event } from "../interfaces/events.interface";
import userServices from "./users.services";

const getRegisterLogs = async () => {
    const registerLogs = await rlModel.find();
    return registerLogs;
    }
const createRegisterLog = async (registerLog: RegisterLog, event: Event) => {
    const userId = event.user.toString();
    const userIsAdmin = await userServices.isAdmin(userId);
    if (!userIsAdmin) {
        console.log('El usuario no tiene permisos para añadir asistencias de los eventos.');
    }
    try {
        const registerLogData = await rlModel.create(registerLog);
        return registerLogData;
    } catch (error: any) {
        console.log('Error al crear el registro de asistencia: ', error.message);
        return new Error;
    }
}
const getRegisterLog = async (id: string) => {
    const registerLog = await rlModel.findById(id);
    return registerLog;
}

const UsersAssistanceCheck = async (registerLog: RegisterLog, user: String) => {
    const assistance = registerLog.UsersAssistance;
    const userId = user.toString();
    
    if (assistance.length === 0 && user != null) {
        console.log("The assistance list is empty");
    }
    try {
        // Buscar el registro de asistencia para el evento específico
        if (registerLog) {
          if (assistance.includes(user.toString())) {
            console.log('El usuario si tiene asistencia en el evento.');
            return true;
        }
        console.log('El usuario no tiene asistencia en el evento.');
        return false;
    }
    }
    catch (error: any) {
        console.log('Error al buscar el registro de asistencia: ', error.message);
        return new Error;
    }
}


export default {
    getRegisterLogs,
    createRegisterLog,
    getRegisterLog,
    UsersAssistanceCheck
}