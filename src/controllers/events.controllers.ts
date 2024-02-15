import { Request, Response } from 'express';
import { Event } from '../interfaces/events.interface'; // Importa la interfaz Event
import EventModel from '../models/events.model'; // Corrige la importación del modelo de eventos
import eventsService from '../services/events.services';
import usersServices from '../services/users.services';

const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventsService.getEvents();
        res.status(200).json(events);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await eventsService.deleteEvent(id, req.body.id);
        res.status(204).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const createEvent = async (req: Request, res: Response) => {
    try {
        const event: Event = req.body; 
        const newEvent = await eventsService.createEvent(event, req.body.id);
        res.status(201).json(newEvent);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getEvents,
    createEvent,
    deleteEvent,
};
