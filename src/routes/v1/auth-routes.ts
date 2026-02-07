import express, { Router } from 'express';
import { signIn, signUp } from '../../controllers/auth-controller';
import validate from '../../middlewares/validate-middleware';
import { userSignupSchema } from '../../schemas/auth-schema';

const router: Router = express.Router();

router.post('/signup', validate(userSignupSchema), signUp);

router.post('/login', signIn);

export default router;
