import router from 'express';
import  Controller  from '../controllers/admin.controller';
import ensureAuth from '../middlewares/auth.middleware';

const routes = router();

routes.get('/', Controller.getAdmins);
routes.post('/', Controller.createAdmin);
routes.delete('/:id', Controller.deleteAdmin);
routes.get('/:id', Controller.getAdminById);
routes.put('/:id', Controller.updateAdmin);
routes.get('/:username', Controller.getAdminByUsername);
routes.get('/events/:username', Controller.getUserEvents);

export default routes;