import express, { Router } from 'express';
import verifyJwtToken from '../../middlewares/auth-middleware';
import requireRoles from '../../middlewares/role-middleware';
import { createExperience } from '../../controllers/experience-controller';

const router: Router = express.Router();

router.post('/', verifyJwtToken, requireRoles(['host', 'admin']), createExperience);

export default router;
