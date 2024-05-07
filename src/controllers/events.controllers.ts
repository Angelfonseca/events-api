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
        await eventsService.deleteEvent(id, req.body.id);
        res.status(204).end();
    } catch (error: any) {
        handleHttp(res, 500, "ERROR TO DELETE EVENT");
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

export default {
    getEvents,
    createEvent,
    deleteEvent,
    getActiveEvents
};
