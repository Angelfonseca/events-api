import { Router } from 'express';
import Controller from '../controllers/events.controllers';

const routes = Router();

routes.get('/', Controller.getEvents);
routes.post('/', Controller.createEvent);
routes.post('/:id', Controller.deleteEvent);
routes.get('/active', Controller.getActiveEvents);
routes.get('/visualizedby/:id', Controller.addVisualizedBy);
routes.post('/accept/:id', Controller.acceptAssistance);
routes.get('/user/:username', Controller.userEvents);
routes.post('/isregistered/:id', Controller.isRegistered);
routes.post('/assistance/:id', Controller.deleteAssistance);


export default routes;