import express from 'express';
import { userController } from '../controllers/userController';

export const router = express.Router();
const port = 3000;

//User management//

//AuthUser signup
router.post('/signup', (req, res) => userController.signup(req, res));
//AuthUser login
router.get('/login', (req, res) => userController.login(req, res));

//AuthUser edit
router.post('/edit_profile', (req, res) => userController.edit(req, res));

//Events//
router.post('/join_event', (req, res) => userController.joinEvent(req, res));
