import express from 'express';
import { eventController } from '../controllers/eventController';
export const router = express.Router();
const port = 3000;

//Create event
router.post('/create', (req, res) => eventController.create(req, res));

//Edit event
router.post('/edit', (req, res) => eventController.edit(req, res));
//Close event
router.post('/close', (req, res) => eventController.close(req, res));
//Event getters//

//Lists events
router.get('/list_events', (req, res) => eventController.listEvents(req, res));
