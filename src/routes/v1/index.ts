import express, { Router } from 'express';
import authRoutes from './auth-routes';
import experienceRoute from './experience-route';

const router: Router = express.Router();

router.use('/auth', authRoutes);

router.use('/experiences', experienceRoute);

export default router;
