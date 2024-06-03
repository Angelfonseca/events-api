
import { RegisterLog } from "../interfaces/registerLog.interface";
import rlModel from "../models/registerLog.model";
import { handleHttp } from "../utils/error.handle";
import { User } from "../interfaces/users.interface";
import { Event } from "../interfaces/events.interface";
import userServices from "./users.services";

const getRegisterLogs = async () => {
    const registerLogs = await rlModel.find();
    return registerLogs;
    }
const createRegisterLog = async (registerLog: RegisterLog) => {
    const newRegisterLog = await rlModel.create(registerLog);
    return newRegisterLog;
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

const addAssistance = async (id: string, username: string) => {
    const registerLog = await rlModel.findOne({ event: id });
    if (!registerLog) {
        throw new Error(`No se encontró el registro de asistencia con el ID proporcionado.`);
    }
    registerLog.UsersAssistance.push(username);
    await registerLog.save();
    return registerLog;
}

const addAssistancesandDuration = async (id: string, usernames: string[], duration: number) => {
    const registerLog = await rlModel.findOne({ event: id });
    if (!registerLog) {
        throw new Error(`Evento no encontrado.`);
    }
    if (duration <= 0) {
        throw new Error(`Ingrese un tiempo de duración válido.`);
    }
    
    registerLog.UsersAssistance = registerLog.UsersAssistance.concat(usernames);
    registerLog.duration = duration; // Asigna el nuevo valor de duración
    await registerLog.save();
    
    return registerLog;
}

const addGuessAssistance = async (id: string, guess: Array<{ nombre: string; lugar: string }>) => {
    const registerLog = await rlModel.findOne({ event: id });
    if (!registerLog) {
        throw new Error(`Evento no encontrado.`);
    }

    registerLog.UsersAssistance = registerLog.UsersAssistance.concat(guess);
    await registerLog.save();
    return registerLog;
};





export default {
    getRegisterLogs,
    createRegisterLog,
    getRegisterLog,
    UsersAssistanceCheck,
    addAssistance,
    addAssistancesandDuration,
    addGuessAssistance,

}