import express from 'express';

import usersRoutes from './routes/users.routes';
import eventsRoutes from './routes/events.routes';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', usersRoutes);
app.use('/api', eventsRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});