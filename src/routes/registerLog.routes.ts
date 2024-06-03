import router from 'express';
import Controller  from '../controllers/registerLog.controller';

const routes = router();

routes.get('/', Controller.getRegisterLogs);
routes.post('/', Controller.createRegisterLog);
routes.get('/:id', Controller.getRegisterLog);
routes.post('/assistance/:id', Controller.addAssistance);
routes.post('/assistances/:id', Controller.addAssistances);
routes.post('/guess/:id', Controller.addGuessAssistance);

export default routes;