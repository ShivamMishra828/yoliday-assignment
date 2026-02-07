import express, { Router } from 'express';
import verifyJwtToken from '../../middlewares/auth-middleware';
import requireRoles from '../../middlewares/role-middleware';
import { createExperience, updateExperienceStatus } from '../../controllers/experience-controller';
import validate from '../../middlewares/validate-middleware';
import {
    createExperienceSchema,
    experienceIdParamSchema,
    updateExperienceStatusSchema,
} from '../../schemas/experience-schema';

const router: Router = express.Router();

router.post(
    '/',
    validate(createExperienceSchema),
    verifyJwtToken,
    requireRoles(['host', 'admin']),
    createExperience,
);

router.patch(
    '/:id/status',
    validate(experienceIdParamSchema, 'params'),
    validate(updateExperienceStatusSchema, 'body'),
    verifyJwtToken,
    requireRoles(['host', 'admin']),
    updateExperienceStatus,
);

export default router;
