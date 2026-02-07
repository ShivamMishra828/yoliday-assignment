import express, { Router } from 'express';
import { signIn, signOut, signUp } from '../../controllers/auth-controller';
import validate from '../../middlewares/validate-middleware';
import { userSigninSchema, userSignupSchema } from '../../schemas/auth-schema';
import verifyJwtToken from '../../middlewares/auth-middleware';

const router: Router = express.Router();

router.post('/signup', validate(userSignupSchema), signUp);

router.post('/login', validate(userSigninSchema), signIn);

router.get('/logout', verifyJwtToken, signOut);

export default router;
