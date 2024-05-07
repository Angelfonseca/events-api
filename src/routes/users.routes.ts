import router from 'express';
import  Controller  from '../controllers/users.controllers';
import ensureAuth from '../middlewares/auth.middleware';

const routes = router();

routes.get('/users', Controller.getUsers);
routes.post('/users', Controller.createUser);
routes.post('/users/login', Controller.login);
routes.get('/users/no-admins', Controller.getNoAdminsEmail);

export default routes;
