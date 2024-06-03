import { Request, Response } from 'express';
import { Event } from '../interfaces/events.interface';
import EventModel from '../models/events.model';
import eventsService from '../services/events.services';
import usersServices from '../services/users.services';
import { handleHttp } from '../utils/error.handle';

const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventsService.getEvents();
        res.status(200).json(events);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET EVENTS");
    }
};

const deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; 
      const userId = req.body.user; 
  
      await eventsService.deleteEvent(id, userId); 
  
      res.status(204).end();
    } catch (error: any) {
        console.error('Error deleting event: ', error);
      handleHttp(res, 500, "ERROR TO DELETE EVENT");
      return new Error;
    }
  };
  

const createEvent = async (req: Request, res: Response) => {
    try {
        const event: Event = req.body;
        const newEvent = await eventsService.createEvent(event);
        res.status(201).json(newEvent);
    } catch (error: any) {
        handleHttp(res, 500, "Error creating event");
        console.error('Error creating event: ', error);
    }
};
const getActiveEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventsService.getUpdatedEvents();
        res.status(200).json(events);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET ACTIVE EVENTS");
        return new Error;
    }
}

const addVisualizedBy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await eventsService.addVisualizedBy(id);
        const event = await eventsService.getEventbyId(id);
        res.status(200).json({ visualizedby: event.visualizedby });
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO ADD VISUALIZED BY");
    }
}

const acceptAssistance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const username = req.body.username;
        await eventsService.acceptEvent(id, username);
        res.status(200).json({ message: "Assistance accepted" });
        return true;
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO ACCEPT ASSISTANCE");
        return false;
    }
}

const userEvents = async (req: Request, res: Response) => {
    try {
        const { username } = req.params; // Obtener el username de req.params
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
        const events = await eventsService.userEvents(username);

        if (events instanceof Error) {
            return res.status(500).json({ error: events.message });
        }

        res.status(200).json(events);
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO GET USER EVENTS");
    }
};

const isRegistered = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const username = req.body.username;

        // Verificar si el usuario está registrado
        const isUserRegistered = await eventsService.isRegistered(id, username);

        // Enviar una respuesta JSON con el resultado
        res.status(200).json({ isRegistered: isUserRegistered });
    } catch (error: any) {
        // Manejar errores y enviar una respuesta de error
        handleHttp(res, 500, "ERROR TO CHECK IF USER IS REGISTERED");
    }
};

const deleteAssistance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const username = req.body.user;
        const result = await eventsService.deleteAssistance(id, username);
        
        if (!result) {
            res.status(404).json({ message: "User not registered or event not found" });
            return;
        }
        
        res.status(200).json({ message: "Assistance deleted" });
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO DELETE ASSISTANCE");
    }
}




export default {
    getEvents,
    createEvent,
    deleteEvent,
    getActiveEvents,
    addVisualizedBy,
    acceptAssistance,
    userEvents,
    isRegistered,
    deleteAssistance
};
