import router from 'express';
import  Controller  from '../controllers/users.controllers';

const routes = router();

routes.use('/users', Controller.getUsers);
routes.use('/users', Controller.createUser);
routes.use('/users/login', Controller.login);
