import express from 'express';
import dbConnect from './config/db';

import usersRoutes from './routes/users.routes';
import eventsRoutes from './routes/events.routes';
import registerLogRoutes from './routes/registerLog.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/registerLog', registerLogRoutes);


const start = async () => {
  try {
    console.log('Starting server...');
    await app.listen(port);
    console.log(`Server listening on ${port}`);
    await dbConnect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Error starting server: ', error);
  }
}

start();