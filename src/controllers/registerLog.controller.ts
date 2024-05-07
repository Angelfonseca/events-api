import rlService from '../services/registerLog.services';
import { Request, Response } from 'express';
import { Event } from '../interfaces/events.interface';
import { RegisterLog } from '../interfaces/registerLog.interface';
import { User } from '../interfaces/users.interface';
import { handleHttp } from '../utils/error.handle';

const getRegisterLogs = async (req: Request, res: Response) => {
    try {
        const registerLogs = await rlService.getRegisterLogs();
        res.status(200).json({ registerLogs });
    } catch (error: any) {
        handleHttp(res, 500, "Error getting register log");
    }
}

const createRegisterLog = async (req: Request, res: Response) => {
    try {
        const registerLog: RegisterLog = req.body;
        const assistance = registerLog.UsersAssistance;
        if (assistance.length === 0) {
            console.log("The assistance list is empty");
        }
        const event: Event = req.body.event;
        const newRegisterLog = await rlService.createRegisterLog(registerLog, event);
        res.status(201).json(newRegisterLog);
    } catch (error: any) {  
        handleHttp(res, 500, "Error creating register log");
        console.error('Error creating register log: ', error);
    }
};
const getRegisterLog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const registerLog = await rlService.getRegisterLog(id);
        res.status(200).json(registerLog);
    } catch (error: any) {
        handleHttp(res, 500, "Error getting register log");
    }
}

export default {
    getRegisterLogs,
    createRegisterLog,
    getRegisterLog
};
