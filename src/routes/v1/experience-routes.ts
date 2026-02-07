import express, { Router } from 'express';
import verifyJwtToken from '../../middlewares/auth-middleware';
import requireRoles from '../../middlewares/role-middleware';
import { createExperience } from '../../controllers/experience-controller';
import validate from '../../middlewares/validate-middleware';
import { createExperienceSchema } from '../../schemas/experience-schema';

const router: Router = express.Router();

router.post(
    '/',
    validate(createExperienceSchema),
    verifyJwtToken,
    requireRoles(['host', 'admin']),
    createExperience,
);

export default router;
