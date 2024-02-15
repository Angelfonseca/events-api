import { Router } from 'express';
import Controller from '../controllers/events.controllers';

const routes = Router();

routes.use('/notifications', Controller.getEvents);
routes.use('/notifications', Controller.createEvent);
routes.use('/notifications/:id', Controller.deleteEvent);


export default routes;