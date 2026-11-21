import express from 'express';
import { authenticate } from './middleware/authenticate';
import { errorHandler, notFound } from './middleware/errors';
import menuItemsRouter from './routes/menuItems';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Every menu item endpoint requires a valid token.
app.use('/api/v1/menu-items', authenticate, menuItemsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`API running on http://localhost:${PORT}/api/v1`);
});

export default app;
