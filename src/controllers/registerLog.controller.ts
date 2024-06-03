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
        const registerLog = req.body;
        const newRegisterLog = await rlService.createRegisterLog(registerLog);
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

const addAssistance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const username = req.body.username;
        await rlService.addAssistance(id, username);
        res.status(204).end();
    } catch (error: any) {
        handleHttp(res, 500, "Error adding assistance");
    }
}
const addAssistances = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usernames = req.body.usernames;
        const duration = req.body.duration;
        await rlService.addAssistancesandDuration(id, usernames, duration);
        res.status(204).end();
    } catch (error: any) {
        handleHttp(res, 500, "Error adding assistances");
    }
} 
const addGuessAssistance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const guess = req.body.guess; // Esperar que guess sea un array

        if (!Array.isArray(guess)) {
            return res.status(400).json({ message: "El campo 'guess' debe ser un array." });
        }

        if (guess.length === 0) {
            return res.status(400).json({ message: "El campo 'guess' no debe estar vacío." });
        }

        await rlService.addGuessAssistance(id, guess);
        res.status(204).end();
    } catch (error: any) {
        handleHttp(res, 500, "Error adding guess assistance");
        console.log('Error adding guess assistance: ', error);
    }
};




export default {
    getRegisterLogs,
    createRegisterLog,
    getRegisterLog,
    addAssistance,
    addAssistances,
    addGuessAssistance
};
