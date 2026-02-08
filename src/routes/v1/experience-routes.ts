import express, { Router } from 'express';
import verifyJwtToken from '../../middlewares/auth-middleware';
import requireRoles from '../../middlewares/role-middleware';
import {
    blockExperience,
    createExperience,
    findAllExperience,
    publishExperience,
} from '../../controllers/experience-controller';
import validate from '../../middlewares/validate-middleware';
import {
    createExperienceSchema,
    experienceIdParamSchema,
    listExperiencesQuerySchema,
} from '../../schemas/experience-schema';
import { bookExperienceBodySchema } from '../../schemas/booking-schema';
import { bookExperience } from '../../controllers/booking-controller';

const router: Router = express.Router();

router.post(
    '/',
    validate(createExperienceSchema),
    verifyJwtToken,
    requireRoles(['host', 'admin']),
    createExperience,
);

router.patch(
    '/:id/publish',
    validate(experienceIdParamSchema, 'params'),
    verifyJwtToken,
    requireRoles(['host', 'admin']),
    publishExperience,
);

router.patch(
    '/:id/block',
    validate(experienceIdParamSchema, 'params'),
    verifyJwtToken,
    requireRoles(['admin']),
    blockExperience,
);

router.get('/', validate(listExperiencesQuerySchema, 'query'), findAllExperience);

router.post(
    '/:id/book',
    verifyJwtToken,
    validate(experienceIdParamSchema, 'params'),
    validate(bookExperienceBodySchema),
    bookExperience,
);

export default router;
