import { Router } from 'express';
import Controller from '../controllers/events.controllers';

const routes = Router();

routes.get('/', Controller.getEvents);
routes.post('/', Controller.createEvent);
routes.delete('/:id', Controller.deleteEvent);
routes.get('/active', Controller.getActiveEvents);


export default routes;