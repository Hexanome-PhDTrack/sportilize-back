import { router as usersRoute } from './api/users';
import { router as eventsRoute } from './api/events';

import express from 'express';
const app = express();
const port = 3000;

app.use('/api/users', usersRoute);
app.use('/api/events', eventsRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
