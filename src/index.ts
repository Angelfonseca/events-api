import express from 'express';
import dbConnect from './config/db';

import usersRoutes from './routes/users.routes';
import eventsRoutes from './routes/events.routes';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', usersRoutes);
app.use('/api', eventsRoutes);


const start = async () => {
  try {
    console.log('Starting server...');
    await app.listen(port);
    console.log(`Server started on port ${port}`);
    await dbConnect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Error starting server: ', error);
  }
}

start();