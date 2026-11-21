import { Router } from 'express';
import { methodNotAllowed } from '../middleware/methodNotAllowed';
import { renderGreetingPage } from '../views/greeting';
import { endpointDetails } from '../views/endpointDetails';

const router = Router();

router.get('/', (_req, res) => {
	res.type('html').send(renderGreetingPage(endpointDetails));
});

router.all('/', methodNotAllowed(['GET', 'HEAD']));

export default router;
