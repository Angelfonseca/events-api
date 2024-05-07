import router from 'express';
import Controller  from '../controllers/registerLog.controller';

const routes = router();

routes.get('/registerLog', Controller.getRegisterLogs);
routes.post('/registerLog', Controller.createRegisterLog);
routes.get('/registerLog/:id', Controller.getRegisterLog);

export default routes;